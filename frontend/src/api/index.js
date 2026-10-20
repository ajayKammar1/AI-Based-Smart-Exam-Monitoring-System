export const API_URL = 'http://localhost:8000';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
  });
  return response.json();
};

export const checkAuthStatus = async () => {
  const response = await fetch(`${API_URL}/auth/status`);
  return response.json();
};

export const createStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
};

export const uploadStudentPhoto = async (studentId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/students/${studentId}/photo`, {
    method: 'POST',
    body: formData
  });
  return response.json();
};

export const generateStudentEmbedding = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}/embedding`, {
    method: 'POST'
  });
  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${API_URL}/students`);
  return response.json();
};

export const updateStudent = async (studentId, studentData) => {
  const response = await fetch(`${API_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
};

export const deleteStudent = async (studentId) => {
  const response = await fetch(`${API_URL}/students/${studentId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// --- Exam Halls ---
export const getHalls = async () => {
  const response = await fetch(`${API_URL}/exam-halls`);
  return response.json();
};

export const createHall = async (data) => {
  const response = await fetch(`${API_URL}/exam-halls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateHall = async (hallId, data) => {
  const response = await fetch(`${API_URL}/exam-halls/${hallId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteHall = async (hallId) => {
  const response = await fetch(`${API_URL}/exam-halls/${hallId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// --- Exams ---
export const getExams = async () => {
  const response = await fetch(`${API_URL}/exams`);
  return response.json();
};

export const createExam = async (data) => {
  const response = await fetch(`${API_URL}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateExam = async (examId, data) => {
  const response = await fetch(`${API_URL}/exams/${examId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteExam = async (examId) => {
  const response = await fetch(`${API_URL}/exams/${examId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// --- Assignments / Allocations ---
export const assignStudents = async (data) => {
  const response = await fetch(`${API_URL}/exam-students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getAssignedStudents = async (examId) => {
  const response = await fetch(`${API_URL}/exam-students/${examId}`);
  return response.json();
};

export const removeAssignedStudent = async (examId, studentId) => {
  const response = await fetch(`${API_URL}/exam-students/${examId}/${studentId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// --- Reports / Monitoring ---
export const getExamEvents = async (examId) => {
  const response = await fetch(`${API_URL}/monitoring/events/${examId}`);
  return response.json();
};

export const getExamAttendance = async (examId) => {
  const response = await fetch(`${API_URL}/attendance/exam/${examId}`);
  return response.json();
};