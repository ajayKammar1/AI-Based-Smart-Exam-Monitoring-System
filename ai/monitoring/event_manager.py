from datetime import datetime


class EventManager:

    @staticmethod
    def create_event(
        exam_id="",
        hall_id="",
        student_id="",
        tracking_id=None,
        student_name="Unknown",
        event_type="UNKNOWN",
        confidence=0.0,
        suspicion_score=0,
        head_pose="CENTER",
        hand_near_face=False,
        hand_above_shoulder=False,
        hands_missing=False,
        multiple_faces=False,
        unknown_face=False,
        details=None
    ):

        if details is None:
            details = {}

        return {

            "exam_id": exam_id,

            "hall_id": hall_id,

            "student_id": student_id,

            "tracking_id": tracking_id,

            "student_name": student_name,

            "event_type": event_type,

            "confidence": round(confidence, 2),

            "suspicion_score": suspicion_score,

            "head_pose": head_pose,

            "hand_near_face": hand_near_face,

            "hand_above_shoulder": hand_above_shoulder,

            "hands_missing": hands_missing,

            "multiple_faces": multiple_faces,

            "unknown_face": unknown_face,

            "timestamp": datetime.now().isoformat(),

            "details": details

        }

    @staticmethod
    def print_event(event):

        print("\n========== EVENT ==========")

        print(f"Student      : {event['student_name']}")

        print(f"Student ID   : {event['student_id']}")

        print(f"Tracking ID  : {event['tracking_id']}")

        print(f"Event        : {event['event_type']}")

        print(f"Confidence   : {event['confidence']}")

        print(f"Suspicion    : {event['suspicion_score']}")

        print(f"Time         : {event['timestamp']}")

        print("===========================\n")