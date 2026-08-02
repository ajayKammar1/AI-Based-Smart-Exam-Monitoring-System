from backend.websocket.manager import manager



async def send_detection(data):

    await manager.broadcast(
        data
    )