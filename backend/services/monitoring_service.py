from datetime import datetime

from backend.database.collections import events



class MonitoringService:


    @staticmethod
    def save_event(data):

        event = {

            "exam_id": data.get("exam_id"),

            "student_id": data.get("student_id"),

            "tracking_id": data.get("tracking_id"),


            "event_type": data.get(
                "event_type"
            ),


            "confidence": data.get(
                "confidence",
                0
            ),


            "details": data.get(
                "details",
                {}
            ),


            "timestamp": datetime.now()

        }


        events.insert_one(event)


        return True



    @staticmethod
    def get_events(exam_id):

        result=[]


        for event in events.find(
            {
                "exam_id":exam_id
            },
            {
                "_id":0
            }
        ):

            result.append(event)


        return result