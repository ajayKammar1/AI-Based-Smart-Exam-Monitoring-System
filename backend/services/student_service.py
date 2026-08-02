from backend.database.collections import students


class StudentService:

    @staticmethod
    def create(data):

        if students.find_one({"student_id": data.student_id}):
            return False

        students.insert_one({
            "student_id": data.student_id,
            "name": data.name,
            "usn": data.usn,
            "department": data.department,
            "semester": data.semester,
            "email": data.email,
            "phone": data.phone,
            "photo_path": "",
            "embedding_path": "",
            "status": True
        })

        return True

    @staticmethod
    def get_all():

        data = []

        for student in students.find({}, {"_id": 0}):
            data.append(student)

        return data

    @staticmethod
    def get(student_id):

        return students.find_one(
            {"student_id": student_id},
            {"_id": 0}
        )

    @staticmethod
    def update(student_id, data):

        update_data = {
            k: v
            for k, v in data.dict(exclude_unset=True).items()
        }

        students.update_one(
            {"student_id": student_id},
            {"$set": update_data}
        )

    @staticmethod
    def delete(student_id):

        students.delete_one(
            {"student_id": student_id}
        )

    @staticmethod
    def update_photo(student_id, photo_path):

        students.update_one(
            {
                "student_id": student_id
            },
            {
                "$set": {
                    "photo_path": photo_path
                }
            }
        )