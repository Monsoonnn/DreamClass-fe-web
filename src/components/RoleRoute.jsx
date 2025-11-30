import { Navigate } from 'react-router-dom';

export default function RoleRoute({ allowedRoles, children }) {
  const userRole = localStorage.getItem('role');

  // Chưa có role → chưa login → về login
  if (!userRole) return <Navigate to="/login" replace />;

  // Nếu allowedRoles không tồn tại → cho truy cập bình thường
  if (!Array.isArray(allowedRoles)) return children;

  // Role không hợp lệ
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
