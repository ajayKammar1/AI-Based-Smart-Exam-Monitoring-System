import asyncio
import json
import threading
import websockets

from .config import WS_URL


class WebSocketClient:

    def __init__(self):

        self.websocket = None
        self.connected = False
        self.loop = None

    async def connect(self):

        while True:

            try:

                print(f"Connecting to {WS_URL}...")

                self.websocket = await websockets.connect(WS_URL)

                self.connected = True

                print("WebSocket Connected")

                await self.listen()

            except Exception as e:

                self.connected = False

                print("WebSocket Error:", e)

                print("Reconnecting in 5 seconds...")

                await asyncio.sleep(5)

    async def listen(self):

        try:

            while True:

                message = await self.websocket.recv()

                print("Server:", message)

        except Exception:

            self.connected = False

    async def send(self, data):

        if not self.connected:

            return

        try:

            await self.websocket.send(
                json.dumps(data)
            )

        except Exception as e:

            self.connected = False
            print("Send Error:", e)

    def start(self):

        def runner():

            self.loop = asyncio.new_event_loop()

            asyncio.set_event_loop(self.loop)

            self.loop.run_until_complete(
                self.connect()
            )

        threading.Thread(
            target=runner,
            daemon=True
        ).start()

    def send_event(self, data):

        if not self.connected:

            return

        asyncio.run_coroutine_threadsafe(
            self.send(data),
            self.loop
        )