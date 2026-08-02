from backend.database.collections import exams


class ExamService:


    @staticmethod
    def create(data):

        exists = exams.find_one(
            {
                "exam_id": data.exam_id
            }
        )


        if exists:
            return False


        exams.insert_one({

            "exam_id": data.exam_id,

            "subject_name": data.subject_name,

            "subject_code": data.subject_code,

            "department": data.department,

            "semester": data.semester,

            "hall_id": data.hall_id,

            "exam_date": data.exam_date,

            "start_time": data.start_time,

            "end_time": data.end_time,

            "status": "Scheduled"

        })


        return True



    @staticmethod
    def get_all():

        result=[]


        for exam in exams.find(
            {},
            {"_id":0}
        ):

            result.append(exam)


        return result



    @staticmethod
    def get(exam_id):

        return exams.find_one(

            {
                "exam_id":exam_id
            },

            {
                "_id":0
            }

        )



    @staticmethod
    def update(
        exam_id,
        data
    ):

        update_data={

            k:v

            for k,v in data.dict(
                exclude_unset=True
            ).items()

        }


        exams.update_one(

            {
                "exam_id":exam_id
            },

            {
                "$set":update_data
            }

        )



    @staticmethod
    def delete(exam_id):

        exams.delete_one(

            {
                "exam_id":exam_id
            }

        )



    @staticmethod
    def change_status(
        exam_id,
        status
    ):

        exams.update_one(

            {
                "exam_id":exam_id
            },

            {
                "$set":
                {
                    "status":status
                }
            }

        )