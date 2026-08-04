from backend.database.collections import attendance

class AttendanceService:

    @staticmethod
    def mark_attendance(data):
        attendance.update_one(
            {
                "exam_id": data.exam_id,
                "student_id": data.student_id,
            },
            {
                "$set": {
                    "exam_id": data.exam_id,
                    "student_id": data.student_id,
                    "hall_id": data.hall_id,
                    "status": data.status
                }
            },
            upsert=True
        )
        return True

    @staticmethod
    def get_attendance_for_exam(exam_id):
        data = []
        for record in attendance.find({"exam_id": exam_id}, {"_id": 0}):
            data.append(record)
        return data

    @staticmethod
    def get_attendance_for_student(student_id):
        data = []
        for record in attendance.find({"student_id": student_id}, {"_id": 0}):
            data.append(record)
        return data
