import asyncio
import json
import websockets


async def main():

    uri = "ws://127.0.0.1:8000/ws/monitor"

    async with websockets.connect(uri) as websocket:

        print("Connected")

        await websocket.send(
            json.dumps({
                "exam_id":"EX001",
                "student_id":"ST001",
                "tracking_id":1,
                "event_type":"HAND_NEAR_FACE",
                "confidence":0.95
            })
        )

        response = await websocket.recv()

        print(response)


asyncio.run(main())