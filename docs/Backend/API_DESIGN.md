# API_DESIGN.md

# AI-Based Offline Exam Malpractice Detection System

## Backend REST API Specification

**Base URL**

```text id="bhg4zr"
http://localhost:8000/api
```

---

# Module Overview

```text id="4tkwv7"
/auth

/students

/exam-halls

/exams

/exam-students

/attendance

/monitoring

/events

/reports

/dashboard

/settings
```

---

# 1. Authentication

## Login

```http
POST /auth/login
```

### Request

```json id="zbywnm"
{
    "username":"admin",
    "password":"admin@123"
}
```

### Response

```json id="nls4op"
{
    "success": true,
    "message": "Login Successful"
}
```

---

## Logout

```http
POST /auth/logout
```

---

# 2. Student Management

## Add Student

```http
POST /students
```

Request

```json id="esu8bo"
{
    "student_id":"ST001",
    "name":"Ajay",
    "usn":"1RV22CS001",
    "department":"CSE",
    "semester":8,
    "email":"ajay@example.com",
    "phone":"9876543210"
}
```

---

## Get Students

```http
GET /students
```

---

## Get Student

```http
GET /students/{student_id}
```

---

## Update Student

```http
PUT /students/{student_id}
```

---

## Delete Student

```http
DELETE /students/{student_id}
```

---

## Upload Student Photo

```http
POST /students/{student_id}/photo
```

Request

```text id="0g03qz"
multipart/form-data
```

---

## Generate Face Embedding

```http
POST /students/{student_id}/embedding
```

---

# 3. Exam Hall Management

## Create Hall

```http
POST /exam-halls
```

---

## Get Halls

```http
GET /exam-halls
```

---

## Get Hall

```http
GET /exam-halls/{hall_id}
```

---

## Update Hall

```http
PUT /exam-halls/{hall_id}
```

---

## Delete Hall

```http
DELETE /exam-halls/{hall_id}
```

---

# 4. Exam Management

## Create Exam

```http
POST /exams
```

Request

```json id="a6ayje"
{
    "subject_name":"Database Management",
    "subject_code":"CS501",
    "department":"CSE",
    "semester":5,
    "hall_id":"HALL001",
    "exam_date":"2026-10-20",
    "start_time":"10:00",
    "end_time":"13:00"
}
```

---

## Get Exams

```http
GET /exams
```

---

## Get Exam

```http
GET /exams/{exam_id}
```

---

## Update Exam

```http
PUT /exams/{exam_id}
```

---

## Delete Exam

```http
DELETE /exams/{exam_id}
```

---

## Start Exam

```http
POST /exams/{exam_id}/start
```

---

## Stop Exam

```http
POST /exams/{exam_id}/stop
```

---

# 5. Student Assignment

## Assign Students

```http
POST /exam-students
```

Request

```json id="jlwm5z"
{
    "exam_id":"EX001",
    "students":[
        {
            "student_id":"ST001",
            "seat_number":"A-01"
        },
        {
            "student_id":"ST002",
            "seat_number":"A-02"
        }
    ]
}
```

---

## Get Assigned Students

```http
GET /exam-students/{exam_id}
```

---

## Remove Student

```http
DELETE /exam-students/{exam_id}/{student_id}
```

---

# 6. Attendance

## Mark Attendance

```http
POST /attendance
```

---

## Get Attendance

```http
GET /attendance/{exam_id}
```

---

## Student Attendance

```http
GET /attendance/{exam_id}/{student_id}
```

---

# 7. Monitoring

These APIs receive data from the AI engine.

## Recognition

```http
POST /monitoring/recognition
```

---

## Head Pose

```http
POST /monitoring/head-pose
```

---

## Hand Detection

```http
POST /monitoring/hands
```

---

## Pose Detection

```http
POST /monitoring/pose
```

---

## Tracking

```http
POST /monitoring/tracking
```

---

## Live Frame Status

```http
POST /monitoring/frame
```

---

# 8. Events

## Save Event

```http
POST /events
```

---

## Get Events

```http
GET /events
```

---

## Events by Exam

```http
GET /events/exam/{exam_id}
```

---

## Events by Student

```http
GET /events/student/{student_id}
```

---

# 9. Reports

## Attendance Report

```http
GET /reports/attendance/{exam_id}
```

---

## Suspicion Report

```http
GET /reports/suspicion/{exam_id}
```

---

## Student Report

```http
GET /reports/student/{student_id}
```

---

## Export PDF

```http
GET /reports/pdf/{exam_id}
```

---

## Export Excel

```http
GET /reports/excel/{exam_id}
```

---

# 10. Dashboard

## Dashboard Summary

```http
GET /dashboard
```

---

## Live Monitoring

```http
GET /dashboard/live
```

---

## Active Exams

```http
GET /dashboard/exams
```

---

## Students Present

```http
GET /dashboard/attendance
```

---

## Event Statistics

```http
GET /dashboard/events
```

---

# 11. Settings

## Get Settings

```http
GET /settings
```

---

## Update Settings

```http
PUT /settings
```

---

# Complete Backend Flow

```text id="s0b57r"
Login
   │
   ▼
Dashboard
   │
   ├─────────────┐
   ▼             ▼
Students     Exam Halls
   │             │
   └──────┬──────┘
          ▼
      Create Exam
          │
          ▼
 Assign Students
          │
          ▼
     Start Exam
          │
          ▼
 AI Monitoring APIs
          │
          ▼
       Events
          │
          ▼
    Attendance
          │
          ▼
       Reports
          │
          ▼
 React Dashboard
```

---

# Development Order

```text id="xhqffj"
Phase 1
✔ Authentication

Phase 2
✔ Student APIs

Phase 3
✔ Exam Hall APIs

Phase 4
✔ Exam APIs

Phase 5
✔ Assignment APIs

Phase 6
✔ Monitoring APIs

Phase 7
✔ Attendance APIs

Phase 8
✔ Events APIs

Phase 9
✔ Reports APIs

Phase 10
✔ Dashboard APIs
```
