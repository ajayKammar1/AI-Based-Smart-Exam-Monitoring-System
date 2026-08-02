from .collections import (
    students,
    exam_halls,
    exams,
    exam_students,
)

students.create_index("student_id", unique=True)

exam_halls.create_index("hall_id", unique=True)

exams.create_index("exam_id", unique=True)

exam_students.create_index(
    [
        ("exam_id", 1),
        ("student_id", 1)
    ],
    unique=True
)

print("✅ MongoDB Indexes Created")