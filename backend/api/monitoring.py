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
def get_events(
    exam_id:str
):

    return MonitoringService.get_events(
        exam_id
    )