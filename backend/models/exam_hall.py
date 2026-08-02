from pydantic import BaseModel
from typing import Optional


class ExamHallCreate(BaseModel):

    hall_id: str
    hall_name: str
    capacity: int
    camera_count: int
    location: str


class ExamHallUpdate(BaseModel):

    hall_name: Optional[str] = None
    capacity: Optional[int] = None
    camera_count: Optional[int] = None
    location: Optional[str] = None
    status: Optional[bool] = None