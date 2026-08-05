import React, { useState, useEffect } from 'react';
import { getStudents } from '../api';
import './StudentsList.css';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to load students. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="students-list-container loading">Loading students...</div>;
  }

  if (error) {
    return <div className="students-list-container error">{error}</div>;
  }

  return (
    <div className="students-list-container">
      <div className="students-list-header">
        <h2>Registered Students</h2>
        <p>List of all students enrolled in the system.</p>
      </div>
      
      {students.length === 0 ? (
        <div className="empty-state">
          <p>No students found. Register a new student to get started.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>USN</th>
                <th>Department</th>
                <th>Sem</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  <td>{student.usn}</td>
                  <td>{student.department}</td>
                  <td>{student.semester}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
