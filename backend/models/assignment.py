from pydantic import BaseModel
from typing import List


class StudentAssignment(BaseModel):

    student_id: str
    seat_number: str



class AssignmentCreate(BaseModel):

    exam_id: str

    students: List[StudentAssignment]