from fastapi import APIRouter

from backend.models.exam_hall import (
    ExamHallCreate,
    ExamHallUpdate
)

from backend.services.hall_service import HallService



router = APIRouter(

    prefix="/exam-halls",

    tags=["Exam Halls"]

)



@router.post("")
def create_hall(
    hall: ExamHallCreate
):

    result = HallService.create(
        hall
    )


    if not result:

        return {

            "success":False,

            "message":"Hall already exists"

        }


    return {

        "success":True,

        "message":"Exam Hall Created"

    }





@router.get("")
def get_halls():

    return HallService.get_all()





@router.get("/{hall_id}")
def get_hall(
    hall_id:str
):

    return HallService.get(
        hall_id
    )





@router.put("/{hall_id}")
def update_hall(

    hall_id:str,

    hall:ExamHallUpdate

):

    HallService.update(

        hall_id,

        hall

    )


    return {

        "success":True,

        "message":"Hall Updated"

    }





@router.delete("/{hall_id}")
def delete_hall(

    hall_id:str

):

    HallService.delete(
        hall_id
    )


    return {

        "success":True,

        "message":"Hall Deleted"

    }