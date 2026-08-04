from fastapi import APIRouter

from backend.models.attendance import AttendanceCreate
from backend.services.attendance_service import AttendanceService

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.post("")
def mark_attendance(data: AttendanceCreate):
    AttendanceService.mark_attendance(data)
    return {
        "success": True,
        "message": "Attendance marked successfully"
    }

@router.get("/exam/{exam_id}")
def get_exam_attendance(exam_id: str):
    return AttendanceService.get_attendance_for_exam(exam_id)

@router.get("/student/{student_id}")
def get_student_attendance(student_id: str):
    return AttendanceService.get_attendance_for_student(student_id)
