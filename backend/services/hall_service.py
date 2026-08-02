from backend.database.collections import exam_halls


class HallService:


    @staticmethod
    def create(data):

        existing = exam_halls.find_one(
            {
                "hall_id": data.hall_id
            }
        )


        if existing:
            return False


        exam_halls.insert_one({

            "hall_id": data.hall_id,

            "hall_name": data.hall_name,

            "capacity": data.capacity,

            "camera_count": data.camera_count,

            "location": data.location,

            "status": True

        })


        return True



    @staticmethod
    def get_all():

        halls=[]


        for hall in exam_halls.find(
            {},
            {"_id":0}
        ):

            halls.append(hall)


        return halls



    @staticmethod
    def get(hall_id):

        return exam_halls.find_one(
            {
                "hall_id":hall_id
            },
            {
                "_id":0
            }
        )



    @staticmethod
    def update(
        hall_id,
        data
    ):

        update_data = {

            k:v

            for k,v in data.dict(
                exclude_unset=True
            ).items()

        }


        exam_halls.update_one(

            {
                "hall_id":hall_id
            },

            {
                "$set":update_data
            }

        )



    @staticmethod
    def delete(hall_id):

        exam_halls.delete_one(

            {
                "hall_id":hall_id
            }

        )