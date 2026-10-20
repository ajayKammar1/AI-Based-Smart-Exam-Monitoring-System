import React, { useState, useEffect } from 'react';
import { getExams, getStudents, getAssignedStudents, assignStudents, removeAssignedStudent } from '../api';
import { Users, UserMinus, Plus, Shield } from 'lucide-react';
import './Halls.css'; // Reuse generic container styling
import './ExamAllocation.css';

const ExamAllocation = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedExamId, setSelectedExamId] = useState('');
  const [assignedStudents, setAssignedStudents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for adding one student at a time
  const [newAssignment, setNewAssignment] = useState({ student_id: '', seat_number: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchAssignedStudents(selectedExamId);
    } else {
      setAssignedStudents([]);
    }
  }, [selectedExamId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [examsData, studentsData] = await Promise.all([getExams(), getStudents()]);
      setExams(examsData);
      setStudents(studentsData);
      if (examsData.length > 0) {
        setSelectedExamId(examsData[0].exam_id);
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
      setError("Failed to load exams and students.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedStudents = async (examId) => {
    try {
      setAssignmentLoading(true);
      const data = await getAssignedStudents(examId);
      setAssignedStudents(data);
    } catch (err) {
      console.error("Failed to fetch assigned students", err);
      // Data might be 404 if no students assigned, so we handle it gracefully by setting empty
      setAssignedStudents([]);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedExamId || !newAssignment.student_id || !newAssignment.seat_number) {
      alert("Please select a student and provide a seat number.");
      return;
    }

    try {
      const payload = {
        exam_id: selectedExamId,
        students: [{
          student_id: newAssignment.student_id,
          seat_number: newAssignment.seat_number
        }]
      };

      const res = await assignStudents(payload);
      if (res.success) {
        setNewAssignment({ student_id: '', seat_number: '' });
        fetchAssignedStudents(selectedExamId);
      } else {
        alert(res.message || "Failed to assign student");
      }
    } catch (err) {
      alert("Error assigning student.");
    }
  };

  const handleRemove = async (studentId) => {
    if (window.confirm("Remove this student from the exam?")) {
      try {
        await removeAssignedStudent(selectedExamId, studentId);
        fetchAssignedStudents(selectedExamId);
      } catch (err) {
        alert("Failed to remove student.");
      }
    }
  };

  const getStudentDetails = (id) => students.find(s => s.student_id === id) || { name: 'Unknown', usn: 'N/A' };
  const selectedExam = exams.find(e => e.exam_id === selectedExamId);

  // Filter out students that are already assigned
  const availableStudents = students.filter(s => !assignedStudents.some(a => a.student_id === s.student_id));

  if (loading) return <div className="page-loading">Loading Exam Data...</div>;

  return (
    <div className="allocations-container">
      <div className="page-header">
        <div>
          <h2>Exam Allocation</h2>
          <p>Assign students to exams and seats</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="allocation-layout">
        
        {/* Left Column: Exam Selection & Add Student Form */}
        <div className="allocation-sidebar">
          <div className="card-panel selection-panel">
            <h3>Select Exam</h3>
            <select 
              className="large-select" 
              value={selectedExamId} 
              onChange={(e) => setSelectedExamId(e.target.value)}
            >
              <option value="" disabled>Select an Exam...</option>
              {exams.map(exam => (
                <option key={exam.exam_id} value={exam.exam_id}>
                  {exam.subject_name} ({exam.exam_code}) - {exam.exam_date}
                </option>
              ))}
            </select>
            
            {selectedExam && (
              <div className="exam-summary">
                <p><strong>Code:</strong> {selectedExam.subject_code}</p>
                <p><strong>Time:</strong> {selectedExam.start_time} - {selectedExam.end_time}</p>
                <p><strong>Hall ID:</strong> {selectedExam.hall_id}</p>
              </div>
            )}
          </div>

          <div className="card-panel add-panel" style={{ opacity: selectedExamId ? 1 : 0.5, pointerEvents: selectedExamId ? 'auto' : 'none' }}>
            <h3><Plus size={18} /> Assign Student</h3>
            <form onSubmit={handleAssign} className="standard-form">
              <div className="form-group">
                <label>Student</label>
                <select 
                  value={newAssignment.student_id} 
                  onChange={(e) => setNewAssignment(prev => ({...prev, student_id: e.target.value}))}
                  required
                >
                  <option value="" disabled>Select a student</option>
                  {availableStudents.map(student => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.name} ({student.usn})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Seat Number</label>
                <input 
                  type="text" 
                  value={newAssignment.seat_number}
                  onChange={(e) => setNewAssignment(prev => ({...prev, seat_number: e.target.value}))}
                  placeholder="e.g. A1, Row 1 Seat 5"
                  required
                />
              </div>
              <button type="submit" className="btn-save full-width" disabled={availableStudents.length === 0}>
                Assign to Exam
              </button>
              {availableStudents.length === 0 && <p className="help-text">All registered students are assigned.</p>}
            </form>
          </div>
        </div>

        {/* Right Column: Assigned Students List */}
        <div className="allocation-main">
          <div className="card-panel list-panel">
            <div className="panel-header">
              <h3><Users size={20} /> Assigned Students ({assignedStudents.length})</h3>
            </div>
            
            {assignmentLoading ? (
              <div className="loading-state">Loading assignments...</div>
            ) : assignedStudents.length === 0 ? (
              <div className="empty-state mini">
                <Shield size={48} className="empty-icon" />
                <p>No students assigned to this exam yet.</p>
              </div>
            ) : (
              <div className="assigned-list">
                {assignedStudents.map(assignment => {
                  const student = getStudentDetails(assignment.student_id);
                  return (
                    <div key={assignment.student_id} className="assigned-card">
                      <div className="assigned-info">
                        <h4>{student.name}</h4>
                        <span className="usn">{student.usn}</span>
                      </div>
                      <div className="seat-badge">
                        Seat: {assignment.seat_number}
                      </div>
                      <button 
                        className="btn-icon remove" 
                        onClick={() => handleRemove(assignment.student_id)}
                        title="Remove student"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExamAllocation;
