from .mongodb import get_database

db = get_database()

students = db["students"]

exam_halls = db["exam_halls"]

exams = db["exams"]

exam_students = db["exam_students"]

attendance = db["attendance"]

events = db["events"]

reports = db["reports"]

settings = db["settings"]

logs = db["logs"]