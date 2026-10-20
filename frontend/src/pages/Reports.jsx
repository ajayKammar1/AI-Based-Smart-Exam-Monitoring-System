import React, { useState, useEffect } from 'react';
import { getExams, getExamEvents, getExamAttendance, getStudents, API_URL } from '../api';
import { FileText, Users, ShieldAlert, Calendar, Filter } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'attendance'

  const [filterName, setFilterName] = useState('');
  const [filterHall, setFilterHall] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch all exams on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
        if (data && data.length > 0) {
          setSelectedExamId(data[0].exam_id);
        }
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };

    const fetchStudentsList = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };
    fetchExams();
    fetchStudentsList();
  }, []);

  const getStudentName = (id) => {
    if (!id || id === 'UNKNOWN' || id === 'Unknown') return 'Unknown';
    const student = students.find(s => s.student_id === id);
    return student ? student.name : id;
  };

  const fetchReportData = async () => {
    if (!selectedExamId) return;
    setLoading(true);
    try {
      const [attendanceData, eventsData] = await Promise.all([
        getExamAttendance(selectedExamId),
        getExamEvents(selectedExamId)
      ]);
      
      setAttendance(attendanceData || []);
      const sortedEvents = (eventsData || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEvents(sortedEvents);
    } catch (err) {
      console.error("Failed to fetch report data", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch report data when selected exam changes
  useEffect(() => {
    fetchReportData();
  }, [selectedExamId]);

  const filteredExams = exams.filter(exam => {
    const matchName = exam.subject_name.toLowerCase().includes(filterName.toLowerCase());
    const matchHall = filterHall === '' || exam.hall_id === filterHall;
    const matchDate = filterDate === '' || exam.exam_date === filterDate;
    return matchName && matchHall && matchDate;
  });

  const availableHalls = [...new Set(exams.map(e => e.hall_id))].filter(Boolean);

  const selectedExam = exams.find(e => e.exam_id === selectedExamId);

  return (
    <div className="reports-container animate-fade-in">
      <header className="reports-header">
        <div>
          <h2>Exam Reports</h2>
          <p className="text-muted">Review attendance and malpractice logs for completed exams.</p>
        </div>
        
        <div className="exam-selector-panel glass-card">
          <div className="filters-row">
            <div className="filter-group">
              <label>Filter Exam</label>
              <select value={filterName} onChange={(e) => setFilterName(e.target.value)} className="filter-input">
                <option value="">All Exams</option>
                {[...new Set(exams.map(e => e.subject_name))].filter(Boolean).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Filter Hall</label>
              <select value={filterHall} onChange={(e) => setFilterHall(e.target.value)} className="filter-input">
                <option value="">All Halls</option>
                {availableHalls.map(hall => <option key={hall} value={hall}>{hall}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Filter Date</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="filter-input" />
            </div>
          </div>

          <div className="exam-selection-row">
            <div style={{ flex: 1 }}>
              <label style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Select Exam Report:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={selectedExamId} 
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="exam-select"
                  style={{ width: '100%' }}
                >
                  {filteredExams.length === 0 && <option value="">No matching exams</option>}
                  {filteredExams.map(exam => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                      {exam.subject_name} ({exam.exam_date} - Hall {exam.hall_id})
                    </option>
                  ))}
                </select>
                <button onClick={fetchReportData} className="btn btn-secondary">
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {selectedExam && (
        <div className="reports-summary glass-card">
          <div className="summary-stat">
            <Users size={24} className="text-primary" />
            <div>
              <p>Total Present</p>
              <h3>{attendance.length} Students</h3>
            </div>
          </div>
          <div className="summary-stat">
            <ShieldAlert size={24} className="text-danger" />
            <div>
              <p>Total Flagged Events</p>
              <h3>{events.length} Events</h3>
            </div>
          </div>
          <div className="summary-stat">
            <FileText size={24} className="text-success" />
            <div>
              <p>Exam Subject</p>
              <h3>{selectedExam.subject_name}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="reports-content glass-panel">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <ShieldAlert size={18} />
            Malpractice Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Users size={18} />
            Attendance Roster
          </button>
        </div>

        <div className="tab-content">
          {loading ? (
            <div className="loading-state">Loading report data...</div>
          ) : activeTab === 'events' ? (
            <div className="table-responsive">
              {events.length === 0 ? (
                <div className="empty-state">No malpractice events recorded for this exam.</div>
              ) : (
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Event Type</th>
                      <th>Confidence</th>
                      <th>Score at Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((evt, idx) => (
                      <tr key={idx}>
                        <td>{new Date(evt.timestamp).toLocaleTimeString()}</td>
                        <td><strong>{getStudentName(evt.student_id)}</strong></td>
                        <td className="text-muted">{evt.student_id || 'Unknown'}</td>
                        <td>
                          <span className={`badge ${evt.event_type === 'UNKNOWN_FACE' ? 'badge-danger' : 'badge-warning'}`}>
                            {evt.event_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>{(evt.confidence * 100).toFixed(0)}%</td>
                        <td>{evt.details?.score || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              {attendance.length === 0 ? (
                <div className="empty-state">No attendance recorded yet.</div>
              ) : (
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Hall ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((att, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="student-photo-mini">
                            <img 
                              src={`${API_URL}/storage/students/${att.student_id}.jpg`} 
                              alt="Student" 
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = "https://ui-avatars.com/api/?name=Unknown&background=random";
                              }}
                            />
                          </div>
                        </td>
                        <td><strong>{getStudentName(att.student_id)}</strong></td>
                        <td className="text-muted">{att.student_id}</td>
                        <td>{att.hall_id}</td>
                        <td>
                          <span className="badge badge-success">{att.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
