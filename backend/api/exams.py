from fastapi import APIRouter

from backend.models.exam import (
    ExamCreate,
    ExamUpdate
)

from backend.services.exam_service import ExamService


router = APIRouter(

    prefix="/exams",

    tags=["Exams"]

)



@router.post("")
def create_exam(
    exam: ExamCreate
):

    result = ExamService.create(exam)


    if not result:

        return {

            "success":False,

            "message":"Exam already exists"

        }


    return {

        "success":True,

        "message":"Exam Created"

    }





@router.get("")
def get_exams():

    return ExamService.get_all()





@router.get("/{exam_id}")
def get_exam(
    exam_id:str
):

    return ExamService.get(exam_id)





@router.put("/{exam_id}")
def update_exam(

    exam_id:str,

    exam:ExamUpdate

):

    ExamService.update(

        exam_id,

        exam

    )


    return {

        "success":True,

        "message":"Exam Updated"

    }





@router.delete("/{exam_id}")
def delete_exam(

    exam_id:str

):

    ExamService.delete(exam_id)


    return {

        "success":True,

        "message":"Exam Deleted"

    }





@router.post("/{exam_id}/start")
def start_exam(
    exam_id:str
):

    ExamService.change_status(

        exam_id,

        "Running"

    )


    return {

        "success":True,

        "message":"Exam Started"

    }





@router.post("/{exam_id}/stop")
def stop_exam(
    exam_id:str
):

    ExamService.change_status(

        exam_id,

        "Completed"

    )


    return {

        "success":True,

        "message":"Exam Stopped"

    }