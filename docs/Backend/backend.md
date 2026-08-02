# Updated Backend Folder Structure

```text
backend/
│
├── main.py                      # FastAPI application entry point
├── config.py                    # Environment variables & application configuration
│
├── api/                         # REST API Routes
│   ├── __init__.py
│   ├── auth.py                  # Admin login
│   ├── students.py              # Student CRUD
│   ├── exam_halls.py            # Exam Hall CRUD
│   ├── exams.py                 # Exam CRUD
│   ├── assignments.py           # Assign students to exams
│   ├── monitoring.py            # Receive AI monitoring events
│   ├── attendance.py            # Attendance APIs
│   ├── events.py                # Event APIs
│   ├── reports.py               # Report APIs
│   ├── dashboard.py             # Dashboard statistics
│   └── settings.py              # System settings
│
├── auth/
│   ├── __init__.py
│   ├── login.py                 # Fixed admin authentication
│   ├── session.py               # Session validation
│   └── security.py              # Password verification
│
├── database/
│   ├── __init__.py
│   ├── mongodb.py               # MongoDB connection
│   ├── collections.py           # Collection names
│   └── indexes.py               # Database indexes
│
├── models/
│   ├── __init__.py
│   ├── student.py
│   ├── exam_hall.py
│   ├── exam.py
│   ├── assignment.py
│   ├── attendance.py
│   ├── event.py
│   ├── report.py
│   ├── dashboard.py
│   └── response.py
│
├── services/
│   ├── __init__.py
│   ├── student_service.py
│   ├── hall_service.py
│   ├── exam_service.py
│   ├── assignment_service.py
│   ├── attendance_service.py
│   ├── monitoring_service.py
│   ├── event_service.py
│   ├── report_service.py
│   ├── dashboard_service.py
│   ├── upload_service.py
│   └── embedding_service.py
│
├── websocket/
│   ├── __init__.py
│   ├── manager.py               # WebSocket connection manager
│   ├── broadcaster.py           # Broadcast live updates
│   └── routes.py                # WebSocket endpoints
│
├── uploads/
│   ├── students/                # Temporary uploaded student images
│   ├── reports/                 # Generated reports
│   └── temp/
│
└── utils/
    ├── __init__.py
    ├── helpers.py
    ├── validators.py
    ├── responses.py
    ├── logger.py
    └── constants.py
```

---

# Backend Module Responsibilities

### Authentication

* Fixed Admin Login
* Session Validation
* Password Verification

---

### Student Management

* Add Student
* Edit Student
* Delete Student
* Search Student
* Upload Student Photo
* Generate Face Embedding

---

### Exam Hall Management

* Add Hall
* Edit Hall
* Delete Hall
* Capacity
* Camera Count

---

### Exam Management

* Create Exam
* Edit Exam
* Delete Exam
* Schedule Exam
* Start Exam
* Stop Exam

---

### Student Assignment

* Assign Students
* Remove Students
* Seat Number Allocation
* Hall Mapping

---

### Monitoring

Receives data from the AI engine.

Examples:

* Face Recognition
* Head Pose
* Hand Detection
* Pose Detection
* Tracking

---

### Attendance

* Mark Present
* Entry Time
* Exit Time
* Attendance Summary

---

### Events

Stores suspicious activities.

Examples:

* Unknown Face
* Multiple Faces
* Hand Near Face
* Head Left
* Head Right
* Head Down
* Hands Missing

---

### Reports

* Attendance Report
* Event Report
* Suspicion Report
* PDF Export
* Excel Export

---

### Dashboard

Provides statistics for the React frontend.

Examples:

* Active Exams
* Students Present
* Suspicious Events
* Attendance Summary
* Live Monitoring Status

```
```
