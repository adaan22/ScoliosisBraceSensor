import argparse
import asyncio
import json
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

import websockets
from dotenv import load_dotenv
from supabase import create_client

ESP32_WS = os.getenv("ESP32_WS_URL", "ws://192.168.137.20/ws")

_ENV_PATH = Path(__file__).resolve().parent.parent / ".env.local"


def load_env() -> None:
    load_dotenv(_ENV_PATH, override=True)


def env(name: str, fallback: str | None = None) -> str | None:
    value = os.getenv(name, fallback)
    if value is None:
        return None
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        value = value[1:-1].strip()
    return value or None


def get_supabase(access_token: str):
    load_env()

    url = env("NEXT_PUBLIC_SUPABASE_URL")
    key = env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

    if not url or not key:
        raise RuntimeError("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local")

    supabase = create_client(url, key)
    supabase.auth.set_session(access_token, access_token)

    user = supabase.auth.get_user()
    if not user or not user.user:
        raise RuntimeError("Invalid or expired access token.")

    return supabase


def normalize_esp32_json(msg: str) -> str:
    """Quote unquoted ISO timestamps so json.loads succeeds."""
    return re.sub(
        r'("Time"\s*:\s*)(\d{4}-\d{2}-\d{2}T[0-9:+.\-Zz]+)',
        r'\1"\2"',
        msg,
    )


def parse_reading_message(
    msg: str,
    session_start: datetime,
) -> tuple[datetime, float] | None:
    """Parse ESP32 JSON; return (reading_time, average_tension) or None."""
    try:
        data = json.loads(normalize_esp32_json(msg))
    except json.JSONDecodeError:
        return None

    if not isinstance(data, dict):
        return None

    time_raw = data.get("Time")

    # Preferred format: {"Reading": N}
    tension_value: float | None = None
    if "Reading" in data:
        try:
            tension_value = float(data["Reading"])
        except (TypeError, ValueError):
            return None
    else:
        readings: list[float] = []
        for key, value in data.items():
            if re.match(r"^Reading\s*\d+$", str(key), re.IGNORECASE):
                try:
                    readings.append(float(value))
                except (TypeError, ValueError):
                    pass
        if not readings:
            return None
        tension_value = sum(readings) / len(readings)

    avg_tension = tension_value

    # Device "Time": Unix seconds, seconds since session start, or ISO string
    if isinstance(time_raw, (int, float)):
        if time_raw >= 1_000_000_000:
            reading_time = datetime.fromtimestamp(time_raw, tz=timezone.utc)
        else:
            reading_time = session_start + timedelta(seconds=float(time_raw))
    elif isinstance(time_raw, str) and time_raw.strip():
        try:
            reading_time = datetime.fromisoformat(time_raw)
            if reading_time.tzinfo is None:
                reading_time = reading_time.replace(tzinfo=timezone.utc)
        except ValueError:
            reading_time = datetime.now(timezone.utc)
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


EXAMPLE_JSON = '{"Time":2026-07-29T19:00:00-06:00, "Reading":42}'


def test_static_json(supabase) -> None:
    """Parse the example JSON, get the authenticated user ID, and upload to Supabase."""
    print(f"Input JSON: {EXAMPLE_JSON}\n")

    session_start = datetime.now(timezone.utc)
    parsed = parse_reading_message(EXAMPLE_JSON, session_start)

    if parsed is None:
        print("Failed to parse JSON.")
        return

    reading_time, avg_tension = parsed
    print(f"Parsed → time={reading_time.isoformat()}, avg_tension={avg_tension:.2f}")

    user = supabase.auth.get_user()
    if not user or not user.user:
        print("Not authenticated.")
        return

    user_id = user.user.id
    print(f"Authenticated user ID: {user_id}\n")

    res = add_tension_reading(supabase, reading_time, avg_tension)
    print(f"Inserted: {res.data}\n")


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--token", required=True, help="Supabase JWT access token for the authenticated user")
    parser.add_argument("--ws", action="store_true", help="Stream live readings from the ESP32 WebSocket")
    args = parser.parse_args()

    load_env()
    supabase = get_supabase(args.token)

    user = supabase.auth.get_user()
    if user and user.user:
        print(f"Authenticated as user: {user.user.id}\n")

    if args.ws:
        task = asyncio.create_task(test_ws(supabase))
        try:
            await task
        except KeyboardInterrupt:
            print("\nStopping test...")
            task.cancel()
            await asyncio.sleep(0.1)
    else:
        test_static_json(supabase)


if __name__ == "__main__":
    asyncio.run(main())
