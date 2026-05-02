import asyncio
import websockets

ESP32_IP = "ws://192.168.137.193/ws"

async def test_ws():
    try:
        async with websockets.connect(ESP32_IP) as ws:
            print("Connected to ESP32 WebSocket\n")

            while True:
                msg = await ws.recv()
                print("Received:", msg)

    except asyncio.CancelledError:
        print("Closing connection cleanly...")

    except Exception as e:
        print("Error:", e)


async def main():
    task = asyncio.create_task(test_ws())
    # use ctrl + c to interrupt the test and stop it gracefully
    try:
        await task
    except KeyboardInterrupt:
        print("\nStopping test...")
        task.cancel()
        await asyncio.sleep(0.1)


asyncio.run(main())