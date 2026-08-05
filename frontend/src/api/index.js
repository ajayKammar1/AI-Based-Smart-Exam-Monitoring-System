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
