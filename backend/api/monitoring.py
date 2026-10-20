from fastapi import APIRouter

from backend.services.monitoring_service import (
    MonitoringService
)


router = APIRouter(

    prefix="/monitoring",

    tags=["AI Monitoring"]

)



@router.post("/event")
def create_event(data:dict):


    MonitoringService.save_event(
        data
    )


    return {

        "success":True,

        "message":"Event Stored"

    }





@router.get("/events/{exam_id}")
def get_events(exam_id: str):
    return MonitoringService.get_events(exam_id)

from fastapi.responses import StreamingResponse
import asyncio

async def generate_frames():
    from ai.monitoring.monitor import monitor_instance
    while True:
        frame_bytes = monitor_instance.latest_frame_bytes
        if frame_bytes is None:
            await asyncio.sleep(0.1)
            continue
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        await asyncio.sleep(0.05)  # 20 FPS max yield rate

import time

@router.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")


from pydantic import BaseModel

class StartStreamRequest(BaseModel):
    exam_id: str
    hall_id: str

@router.post("/start_stream")
def start_stream(req: StartStreamRequest):
    from ai.monitoring.monitor import monitor_instance
    monitor_instance.start_monitoring(req.exam_id, req.hall_id)
    return {"success": True, "message": "Stream started for exam " + req.exam_id}

@router.post("/stop_stream")
def stop_stream():
    from ai.monitoring.monitor import monitor_instance
    monitor_instance.stop_monitoring()
    return {"success": True, "message": "Stream stopped"}

@router.get("/status")
def stream_status():
    from ai.monitoring.monitor import monitor_instance
    return {
        "is_running": monitor_instance.is_running,
        "exam_id": monitor_instance.exam_id,
        "hall_id": monitor_instance.hall_id
    }