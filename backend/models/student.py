from pydantic import BaseModel, EmailStr
from typing import Optional


class StudentCreate(BaseModel):
    student_id: str
    name: str
    usn: str
    department: str
    semester: int
    email: EmailStr
    phone: str


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    usn: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None