from pydantic import BaseModel
from typing import Optional


class AttendanceCreate(BaseModel):
    exam_id: str
    student_id: str
    hall_id: str
    status: str  # e.g., "Present", "Absent", "Late"


class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
