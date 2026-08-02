from fastapi import APIRouter, WebSocket

from backend.websocket.manager import manager


router = APIRouter()



@router.websocket("/ws/monitor")
async def monitoring_socket(
    websocket:WebSocket
):


    await manager.connect(
        websocket
    )


    try:

        while True:

            data = await websocket.receive_json()


            await manager.broadcast(
                data
            )


    except Exception:

        manager.disconnect(
            websocket
        )