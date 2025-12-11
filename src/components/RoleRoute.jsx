import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role;

  // Nếu trang không quy định allowedRoles thì cho vào
  if (!Array.isArray(allowedRoles)) return children;

  // Nếu role hợp lệ -> cho vào
  if (allowedRoles.includes(userRole)) return children;

  // ❌ Nếu role KHÔNG hợp lệ → Redirect về đúng trang theo role
  if (userRole === 'student') {
    return <Navigate to="/student-study" replace />;
  }

  // teacher hoặc admin → dashboard
  return <Navigate to="/dashboard" replace />;
}
