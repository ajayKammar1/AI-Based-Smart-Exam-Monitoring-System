import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Video, FileText, LayoutDashboard } from 'lucide-react';
import { getStudents, getExams, getHalls } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    totalHalls: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, exams, halls] = await Promise.all([
          getStudents(),
          getExams(),
          getHalls()
        ]);
        setStats({
          totalStudents: students.length || 0,
          totalExams: exams.length || 0,
          totalHalls: halls.length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>System Overview</h1>
        <p className="text-muted">Real-time metrics for AI-Based Offline Exam Malpractice Detection.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} className="text-primary" style={{ color: 'var(--accent-primary)' }}/>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Students</p>
              <h3 style={{ fontSize: '1.5rem' }}>{stats.totalStudents}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <FileText size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Exams</p>
              <h3 style={{ fontSize: '1.5rem' }}>{stats.totalExams}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <LayoutDashboard size={24} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Halls</p>
              <h3 style={{ fontSize: '1.5rem' }}>{stats.totalHalls}</h3>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <Video size={24} className="text-success" />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Camera Status</p>
              <h3 style={{ fontSize: '1.5rem' }}>Online</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Events List placeholder */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent System Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ShieldAlert size={20} className="text-warning" />
              <div>
                <strong>Suspicious Head Movement</strong>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Student ID: ST123 (Looking Left)</p>
              </div>
            </div>
            <span className="badge badge-warning" style={{ alignSelf: 'center' }}>Review Needed</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Users size={20} className="text-success" />
              <div>
                <strong>Student Verified</strong>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Student ID: ST105 (Face Match 98%)</p>
              </div>
            </div>
            <span className="badge badge-success" style={{ alignSelf: 'center' }}>Clear</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
