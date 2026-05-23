import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ChildProfile from './pages/ChildProfile';
import ChildManagement from './pages/ChildManagement';
import UserManagement from './pages/UserManagement';
import AdminSettings from './pages/AdminSettings';
import Chat from './pages/Chat';
import Notices from './pages/Notices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin': return '/admin';
      case 'teacher': return '/teacher';
      case 'parent': return '/parent';
      default: return '/login';
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={getDashboardPath(user.role)} /> : <Signup />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/users" 
            element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/children" 
            element={<ProtectedRoute allowedRoles={['admin']}><ChildManagement /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/settings" 
            element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} 
          />
          <Route 
            path="/teacher" 
            element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/parent" 
            element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/child/:id" 
            element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} 
          />
          <Route 
            path="/chat" 
            element={<ProtectedRoute><Chat /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
