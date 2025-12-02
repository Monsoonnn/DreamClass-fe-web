import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // No user -> Redirect to login (though ProtectedRoute usually catches this)
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role; // Assuming the user object from API has a 'role' field

  // If allowedRoles is not defined -> allow access
  if (!Array.isArray(allowedRoles)) return children;

  // Check if role is allowed
  if (!allowedRoles.includes(userRole)) {
    // You might want to create a 403 page or redirect to dashboard
    return <div className="p-4 text-red-600">Access Denied (403) - You do not have permission to view this page.</div>;
  }

  return children;
}
