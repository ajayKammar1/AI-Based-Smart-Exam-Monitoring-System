from pydantic import BaseModel
from typing import Optional


class ExamCreate(BaseModel):

    exam_id: str

    subject_name: str

    subject_code: str

    department: str

    semester: int

    hall_id: str

    exam_date: str

    start_time: str

    end_time: str



class ExamUpdate(BaseModel):

    subject_name: Optional[str] = None

    subject_code: Optional[str] = None

    hall_id: Optional[str] = None

    exam_date: Optional[str] = None

    start_time: Optional[str] = None

    end_time: Optional[str] = None

    status: Optional[str] = None