import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MonitorPlay, FileText, Settings, Video, LogOut, UserPlus } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <div className="sidebar glass-panel">
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="text-gradient">AI Proctor</h2>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Secure Exam Monitoring</p>
      </div>
      
      <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        
        <NavLink to="/live" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <MonitorPlay size={18} />
          Live Monitoring
        </NavLink>

        <NavLink to="/camera" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <Video size={18} />
          Camera Feed
        </NavLink>
        
        <NavLink to="/students" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <Users size={18} />
          Students
        </NavLink>
        
        <NavLink to="/students/register" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <UserPlus size={18} />
          Register Student
        </NavLink>
        
        <NavLink to="/reports" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <FileText size={18} />
          Reports
        </NavLink>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.5rem' }}>
          <Settings size={18} />
          Settings
        </button>
        <button onClick={logout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
