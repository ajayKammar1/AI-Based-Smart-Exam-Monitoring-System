# DATABASE_DESIGN.md

# AI-Based Offline Exam Malpractice Detection System

## MongoDB Database Design

---

# Database Name

```text
exam_monitoring_system
```

---

# Collections

```text
exam_monitoring_system
│
├── students
├── exam_halls
├── exams
├── exam_students
├── attendance
├── events
├── reports
├── settings
└── logs
```

---

# 1. students

Stores master student information.

```json
{
    "_id": ObjectId,

    "student_id": "ST001",

    "name": "Ajay Kammar",

    "usn": "1RV22CS001",

    "email": "ajay@example.com",

    "phone": "9876543210",

    "department": "CSE",

    "semester": 8,

    "photo_path": "storage/known_faces/ST001/image.jpg",

    "embedding_path": "storage/known_faces/ST001/embedding.npy",

    "status": true,

    "created_at": "",

    "updated_at": ""
}
```

---

# 2. exam_halls

```json
{
    "_id": ObjectId,

    "hall_id": "HALL001",

    "hall_name": "Main Hall",

    "capacity": 120,

    "camera_count": 4,

    "location": "Block A",

    "status": true,

    "created_at": ""
}
```

---

# 3. exams

```json
{
    "_id": ObjectId,

    "exam_id": "EX001",

    "subject_name": "Database Management System",

    "subject_code": "CS501",

    "department": "CSE",

    "semester": 5,

    "exam_date": "2026-10-20",

    "start_time": "10:00",

    "end_time": "13:00",

    "hall_id": "HALL001",

    "status": "Scheduled"
}
```

Status values:

```text
Scheduled

Running

Paused

Completed

Cancelled
```

---

# 4. exam_students

Students assigned to an exam.

```json
{
    "_id": ObjectId,

    "exam_id": "EX001",

    "student_id": "ST001",

    "seat_number": "A-12",

    "status": true
}
```

---

# 5. attendance

```json
{
    "_id": ObjectId,

    "exam_id": "EX001",

    "student_id": "ST001",

    "present": true,

    "entry_time": "",

    "exit_time": ""
}
```

---

# 6. events

Stores all AI detections.

```json
{
    "_id": ObjectId,

    "exam_id": "EX001",

    "student_id": "ST001",

    "camera_id": 1,

    "tracking_id": 4,

    "event": "HAND_NEAR_FACE",

    "confidence": 0.96,

    "image_path": "storage/evidence/event_001.jpg",

    "timestamp": ""
}
```

Possible events:

```text
FACE_DETECTED

UNKNOWN_FACE

MULTIPLE_FACES

FACE_NOT_VISIBLE

HAND_NEAR_FACE

FAST_HAND_MOVEMENT

HANDS_MISSING

HEAD_LEFT

HEAD_RIGHT

HEAD_DOWN
```

---

# 7. reports

```json
{
    "_id": ObjectId,

    "exam_id": "EX001",

    "student_id": "ST001",

    "attendance": true,

    "total_events": 6,

    "suspicion_score": 35,

    "risk_level": "LOW",

    "report_path": "reports/report_EX001_ST001.pdf"
}
```

Risk Levels:

```text
NORMAL

LOW

MEDIUM

HIGH
```

---

# 8. settings

```json
{
    "_id": ObjectId,

    "system_name": "AI Exam Monitoring",

    "admin_username": "admin",

    "admin_password": "admin@123"
}
```

---

# 9. logs

```json
{
    "_id": ObjectId,

    "module": "Monitoring",

    "action": "Exam Started",

    "description": "DBMS Exam Started",

    "created_at": ""
}
```

---

# Database Relationships

```text
Students
      │
      │
      ├──────────────┐
      │              │
      ▼              ▼
Attendance      Exam Students
                     │
                     ▼
                   Exams
                     │
                     ▼
                Exam Hall
                     │
                     ▼
                  Events
                     │
                     ▼
                  Reports
```

---

# Development Order

```text
1. students

2. exam_halls

3. exams

4. exam_students

5. attendance

6. events

7. reports

8. settings

9. logs
```

---

# Backend Progress

```text
☐ MongoDB Connection

☐ Students Collection

☐ Exam Hall Collection

☐ Exams Collection

☐ Exam Students Collection

☐ Attendance Collection

☐ Events Collection

☐ Reports Collection

☐ Settings Collection

☐ Logs Collection
```
