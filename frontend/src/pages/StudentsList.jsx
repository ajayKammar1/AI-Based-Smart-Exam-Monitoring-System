import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent, updateStudent, API_URL } from '../api';
import { Edit2, Trash2, X } from 'lucide-react';
import './StudentsList.css';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit modal state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

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

  const handleDelete = async (studentId) => {
    if (window.confirm(`Are you sure you want to delete student ${studentId}?`)) {
      try {
        await deleteStudent(studentId);
        fetchStudents(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete student:", err);
        alert("Failed to delete student.");
      }
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      name: student.name,
      usn: student.usn,
      department: student.department,
      semester: student.semester,
      email: student.email,
      phone: student.phone
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateStudent(editingStudent.student_id, editFormData);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Failed to update student:", err);
      alert("Failed to update student.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading && students.length === 0) {
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
                <th>Photo</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>USN</th>
                <th>Department</th>
                <th>Sem</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id}>
                  <td>
                    {student.photo_path ? (
                      <img 
                        src={`${API_URL}/${student.photo_path}`} 
                        alt={student.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} 
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div style={{ display: student.photo_path ? 'none' : 'flex', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#888', fontWeight: 'bold' }}>
                      N/A
                    </div>
                  </td>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  <td>{student.usn}</td>
                  <td>{student.department}</td>
                  <td>{student.semester}</td>
                  <td>{student.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon edit" 
                        onClick={() => handleEditClick(student)}
                        title="Edit Student"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(student.student_id)}
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Student: {editingStudent.student_id}</h3>
              <button className="btn-icon close" onClick={() => setEditingStudent(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="edit-form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Full Name</label>
                  <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>USN</label>
                  <input type="text" name="usn" value={editFormData.usn} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" value={editFormData.department} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select name="semester" value={editFormData.semester} onChange={handleEditChange} required>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={updateLoading}>
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
