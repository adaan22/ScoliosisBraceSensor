#!/usr/bin/env python3
"""Fake ESP32 WebSocket that streams tension readings for local dev."""

from __future__ import annotations

import asyncio
import random
from datetime import datetime, timedelta, timezone

import websockets

HOST = "127.0.0.1"
PORT = 8765
PATH = "/ws"
INTERVAL_S = 1.0
# Mountain offset (device format uses fixed -06:00 in payload string)
MT = timezone(timedelta(hours=-6))


def format_message(reading: int) -> str:
    """Match device format: unquoted ISO Time + singular Reading."""
    now = datetime.now(MT)
    time_str = now.strftime("%Y-%m-%dT%H:%M:%S-06:00")
    return f'{{"Time":{time_str}, "Reading":{reading}}}'


async def handler(websocket: websockets.ServerConnection) -> None:
    peer = websocket.remote_address
    print(f"[client connected] {peer}")
    try:
        while True:
            reading = random.randint(20, 95)
            msg = format_message(reading)
            await websocket.send(msg)
            print(f"sent → {msg}")
            await asyncio.sleep(INTERVAL_S)
    except websockets.ConnectionClosed:
        print(f"[client disconnected] {peer}")


async def main() -> None:
    uri = f"ws://{HOST}:{PORT}{PATH}"
    async with websockets.serve(handler, HOST, PORT):
        print(f"Mock ESP32 WebSocket listening on {uri}")
        print('Format: {"Time":YYYY-MM-DDTHH:MM:SS-06:00, "Reading":N}')
        print("Press Ctrl+C to stop.\n")
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
