import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StudentRegistration from './pages/StudentRegistration';
import StudentsList from './pages/StudentsList';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {/* Only show sidebar if authenticated */}
      {isAuthenticated && <Sidebar />}
      
      <main className="main-content" style={{ padding: isAuthenticated ? '2rem' : '0' }}>
        <Routes>
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/students" element={
            <ProtectedRoute>
              <StudentsList />
            </ProtectedRoute>
          } />

          <Route path="/students/register" element={
            <ProtectedRoute>
              <StudentRegistration />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
