import time

from .config import (
    MAX_SUSPICION_SCORE,
    HAND_NEAR_FACE_SCORE,
    HEAD_TURN_SCORE,
    UNKNOWN_FACE_SCORE,
    HANDS_MISSING_SCORE
)


class SuspicionEngine:

    def __init__(self):

        self.students = {}

        self.cooldown = 3

    def _get_student(self, tracking_id):

        if tracking_id not in self.students:

            self.students[tracking_id] = {

                "score": 0,

                "last_event": {},

                "events": []

            }

        return self.students[tracking_id]

    def _can_add(self, student, event):

        now = time.time()

        last = student["last_event"].get(event, 0)

        if now - last >= self.cooldown:

            student["last_event"][event] = now

            return True

        return False

    def add_event(
        self,
        tracking_id,
        event
    ):

        student = self._get_student(
            tracking_id
        )

        event_added = False

        if event == "HAND_NEAR_FACE":

            if self._can_add(student, event):

                student["score"] += HAND_NEAR_FACE_SCORE
                event_added = True

        elif event in [

            "LOOK_LEFT",

            "LOOK_RIGHT",

            "LOOK_UP",

            "LOOK_DOWN"

        ]:

            if self._can_add(student, "HEAD"):

                student["score"] += HEAD_TURN_SCORE
                event_added = True

        elif event == "UNKNOWN_FACE":

            if self._can_add(student, event):

                student["score"] += UNKNOWN_FACE_SCORE
                event_added = True

        elif event == "HANDS_MISSING":

            if self._can_add(student, event):

                student["score"] += HANDS_MISSING_SCORE
                event_added = True

        if student["score"] > MAX_SUSPICION_SCORE:

            student["score"] = MAX_SUSPICION_SCORE

        if event_added:
            student["events"].append({

                "event": event,

                "time": time.strftime("%H:%M:%S")

            })

        return student["score"], event_added

    def get_score(
        self,
        tracking_id
    ):

        return self._get_student(
            tracking_id
        )["score"]

    def get_events(
        self,
        tracking_id
    ):

        return self._get_student(
            tracking_id
        )["events"]

    def reset_student(
        self,
        tracking_id
    ):

        if tracking_id in self.students:

            del self.students[tracking_id]

    def reset_all(self):

        self.students.clear()

    def get_all_scores(self):

        result = {}

        for tracking_id, student in self.students.items():

            result[tracking_id] = student["score"]

        return result