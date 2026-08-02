from backend.database.collections import exam_students


class AssignmentService:


    @staticmethod
    def assign_students(data):

        inserted = 0


        for student in data.students:


            exists = exam_students.find_one(
                {
                    "exam_id": data.exam_id,
                    "student_id": student.student_id
                }
            )


            if exists:
                continue


            exam_students.insert_one({

                "exam_id": data.exam_id,

                "student_id": student.student_id,

                "seat_number": student.seat_number,

                "status": True

            })


            inserted += 1


        return inserted



    @staticmethod
    def get_students(exam_id):

        result=[]


        for item in exam_students.find(
            {
                "exam_id":exam_id
            },
            {
                "_id":0
            }
        ):

            result.append(item)


        return result



    @staticmethod
    def remove_student(
        exam_id,
        student_id
    ):


        exam_students.delete_one(

            {
                "exam_id":exam_id,

                "student_id":student_id
            }

        )