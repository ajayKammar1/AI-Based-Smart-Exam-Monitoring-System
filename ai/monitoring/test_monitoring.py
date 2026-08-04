import unittest
import time
from ai.monitoring.suspicion_engine import SuspicionEngine
from ai.monitoring.event_manager import EventManager
from ai.monitoring.config import (
    MAX_SUSPICION_SCORE,
    HAND_NEAR_FACE_SCORE,
    HEAD_TURN_SCORE,
    UNKNOWN_FACE_SCORE,
    HANDS_MISSING_SCORE
)

class TestSuspicionEngine(unittest.TestCase):
    def setUp(self):
        self.engine = SuspicionEngine()
        # Reduce cooldown for testing so we don't have to wait 3 seconds
        self.engine.cooldown = 0.1

    def test_hand_near_face(self):
        score = self.engine.add_event("track_1", "HAND_NEAR_FACE")
        self.assertEqual(score, HAND_NEAR_FACE_SCORE)
        self.assertEqual(self.engine.get_score("track_1"), HAND_NEAR_FACE_SCORE)

    def test_head_turn_cooldown(self):
        score = self.engine.add_event("track_2", "LOOK_LEFT")
        self.assertEqual(score, HEAD_TURN_SCORE)
        
        # Should not add again immediately due to cooldown (same event type group "HEAD")
        score2 = self.engine.add_event("track_2", "LOOK_RIGHT")
        self.assertEqual(score2, HEAD_TURN_SCORE)
        
        # Wait for cooldown to expire
        time.sleep(0.15)
        score3 = self.engine.add_event("track_2", "LOOK_RIGHT")
        self.assertEqual(score3, HEAD_TURN_SCORE * 2)

    def test_unknown_face(self):
        score = self.engine.add_event("track_3", "UNKNOWN_FACE")
        self.assertEqual(score, UNKNOWN_FACE_SCORE)

    def test_hands_missing(self):
        score = self.engine.add_event("track_4", "HANDS_MISSING")
        self.assertEqual(score, HANDS_MISSING_SCORE)

    def test_max_score_limit(self):
        # Trigger events multiple times to exceed MAX_SUSPICION_SCORE
        for _ in range(15):
            self.engine.add_event("track_5", "UNKNOWN_FACE")
            time.sleep(0.15)
        
        score = self.engine.get_score("track_5")
        self.assertEqual(score, MAX_SUSPICION_SCORE)

class TestEventManager(unittest.TestCase):
    def test_create_event(self):
        event = EventManager.create_event(
            student_id="ST123",
            tracking_id="T1",
            student_name="Ajay",
            event_type="HAND_NEAR_FACE",
            confidence=0.98,
            suspicion_score=20
        )
        self.assertEqual(event["student_id"], "ST123")
        self.assertEqual(event["tracking_id"], "T1")
        self.assertEqual(event["student_name"], "Ajay")
        self.assertEqual(event["event_type"], "HAND_NEAR_FACE")
        self.assertEqual(event["confidence"], 0.98)
        self.assertEqual(event["suspicion_score"], 20)
        self.assertTrue("timestamp" in event)
        self.assertTrue("details" in event)

if __name__ == '__main__':
    unittest.main()
