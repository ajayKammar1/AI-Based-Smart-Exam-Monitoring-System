from fastapi import APIRouter

from backend.models.assignment import (
    AssignmentCreate
)

from backend.services.assignment_service import (
    AssignmentService
)


router = APIRouter(

    prefix="/exam-students",

    tags=["Exam Student Assignment"]

)



@router.post("")
def assign_students(
    data: AssignmentCreate
):

    count = AssignmentService.assign_students(
        data
    )


    return {

        "success":True,

        "message":f"{count} Students Assigned"

    }





@router.get("/{exam_id}")
def get_assigned_students(
    exam_id:str
):

    return AssignmentService.get_students(
        exam_id
    )





@router.delete("/{exam_id}/{student_id}")
def remove_student(

    exam_id:str,

    student_id:str

):

    AssignmentService.remove_student(

        exam_id,

        student_id

    )


    return {

        "success":True,

        "message":"Student Removed"

    }