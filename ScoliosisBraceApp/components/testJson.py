import asyncio
import json
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import websockets
from dotenv import load_dotenv
from supabase import create_client

ESP32_WS = os.getenv("ESP32_WS_URL", "ws://10.104.243.147/ws")

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"


def load_env() -> None:
    """Reload .env.local on every run so edits apply without restarting the shell."""
    load_dotenv(_ENV_PATH, override=True)


def env(name: str, fallback: str | None = None) -> str | None:
    """Read env var; strip optional surrounding quotes from .env values."""
    value = os.getenv(name, fallback)
    if value is None:
        return None
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        value = value[1:-1].strip()
    return value or None


def get_supabase():
    load_env()

    url = env("SUPABASE_URL") or env("NEXT_PUBLIC_SUPABASE_URL")
    key = (
        env("SUPABASE_ANON_KEY")
        or env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    )

    if not url or not key:
        raise RuntimeError(
            "Missing Supabase URL/key in .env.local. Set SUPABASE_URL (or "
            "NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_ANON_KEY (or "
            "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
        )

    if "<project-ref>" in url:
        raise RuntimeError(
            "SUPABASE_URL still looks like a placeholder. Use your real project URL "
            "(e.g. https://nnetwtchhusovmgiwcue.supabase.co)."
        )

    supabase = create_client(url, key)

    access_token = env("SUPABASE_ACCESS_TOKEN")
    refresh_token = env("SUPABASE_REFRESH_TOKEN") or ""

    if access_token:
        supabase.auth.set_session(access_token, refresh_token or access_token)
    else:
        email = env("SUPABASE_USER_EMAIL")
        password = env("SUPABASE_USER_PASSWORD")
        if not email or not password:
            raise RuntimeError(
                "Set SUPABASE_USER_EMAIL and SUPABASE_USER_PASSWORD in .env.local, "
                "or set SUPABASE_ACCESS_TOKEN for token-based auth."
            )
        if "example.com" in email or password == "super-secret-password":
            raise RuntimeError(
                "SUPABASE_USER_EMAIL/PASSWORD still look like placeholders. "
                "Use the real Supabase Auth user for this device."
            )

        auth_res = supabase.auth.sign_in_with_password(
            {"email": email, "password": password}
        )
        if not auth_res.session:
            raise RuntimeError("Supabase sign-in failed: no session returned")
        supabase.auth.set_session(
            auth_res.session.access_token,
            auth_res.session.refresh_token,
        )

    return supabase


def parse_reading_message(
    msg: str,
    session_start: datetime,
) -> tuple[datetime, float] | None:
    """Parse ESP32 JSON; return (reading_time, average_tension) or None."""
    try:
        data = json.loads(msg)
    except json.JSONDecodeError:
        return None

    if not isinstance(data, dict):
        return None

    time_raw = data.get("Time")
    readings: list[float] = []
    for key, value in data.items():
        if re.match(r"^Reading\s*\d+$", str(key), re.IGNORECASE):
            try:
                readings.append(float(value))
            except (TypeError, ValueError):
                pass

    if not readings:
        return None

    avg_tension = sum(readings) / len(readings)

    # Device "Time": Unix seconds, or seconds since WebSocket session start
    if isinstance(time_raw, (int, float)):
        if time_raw >= 1_000_000_000:
            reading_time = datetime.fromtimestamp(time_raw, tz=timezone.utc)
        else:
            reading_time = session_start + timedelta(seconds=float(time_raw))
    else:
        reading_time = datetime.now(timezone.utc)

    return reading_time, avg_tension


def add_tension_reading(
    supabase,
    reading_time: datetime,
    tension_value: float,
):
    if reading_time.tzinfo is None:
        reading_time = reading_time.replace(tzinfo=timezone.utc)

    user = supabase.auth.get_user()
    if not user or not user.user:
        raise RuntimeError("Not authenticated — check Supabase credentials in .env.local")

    user_id = user.user.id

    res = (
        supabase.table("tension_readings")
        .insert(
            {
                "user_id": user_id,
                "time": reading_time.isoformat(),
                "tension_value": tension_value,
            }
        )
        .execute()
    )
    return res


async def test_ws(supabase):
    try:
        async with websockets.connect(ESP32_WS) as ws:
            session_start = datetime.now(timezone.utc)
            print(f"Connected to ESP32 WebSocket ({ESP32_WS})\n")

            while True:
                msg = await ws.recv()
                print("Received:", msg)

                parsed = parse_reading_message(msg, session_start)
                if parsed is None:
                    print("  Skipped: could not parse time/readings\n")
                    continue

                reading_time, avg_tension = parsed
                try:
                    res = await asyncio.to_thread(
                        add_tension_reading,
                        supabase,
                        reading_time,
                        avg_tension,
                    )
                    print(
                        f"  Saved → time={reading_time.isoformat()}, "
                        f"avg_tension={avg_tension:.2f}\n"
                    )
                except Exception as insert_err:
                    print(f"  Supabase insert error: {insert_err}\n")

    except asyncio.CancelledError:
        print("Closing connection cleanly...")

    except Exception as e:
        print("Error:", e)


async def main():
    load_env()
    supabase = get_supabase()
    user = supabase.auth.get_user()
    if user and user.user:
        print(f"Supabase user: {user.user.id}\n")

    task = asyncio.create_task(test_ws(supabase))
    try:
        await task
    except KeyboardInterrupt:
        print("\nStopping test...")
        task.cancel()
        await asyncio.sleep(0.1)


if __name__ == "__main__":
    asyncio.run(main())
