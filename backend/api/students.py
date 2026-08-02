from fastapi import APIRouter

from backend.models.student import (
    StudentCreate,
    StudentUpdate
)

from backend.services.student_service import StudentService
from fastapi import UploadFile, File

from backend.services.upload_service import UploadService

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.post("")
def create_student(student: StudentCreate):

    if not StudentService.create(student):
        return {
            "success": False,
            "message": "Student already exists"
        }

    return {
        "success": True,
        "message": "Student created successfully"
    }


@router.get("")
def get_students():

    return StudentService.get_all()


@router.get("/{student_id}")
def get_student(student_id: str):

    return StudentService.get(student_id)


@router.put("/{student_id}")
def update_student(
    student_id: str,
    student: StudentUpdate
):

    StudentService.update(
        student_id,
        student
    )

    return {
        "success": True,
        "message": "Student updated"
    }


@router.delete("/{student_id}")
def delete_student(student_id: str):

    StudentService.delete(student_id)

    return {
        "success": True,
        "message": "Student deleted"
    }

@router.post("/{student_id}/photo")
def upload_photo(
    student_id: str,
    file: UploadFile = File(...)
):

    path = UploadService.save_student_photo(
        student_id,
        file
    )

    StudentService.update_photo(
        student_id,
        path
    )

    return {
        "success": True,
        "photo_path": path
    }