import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // We can't check HttpOnly cookies directly.
  // We rely on the presence of user info in localStorage as a flag that we are "logged in".
  // If the cookie is invalid, the next API call will fail with 401 and the interceptor will redirect to login.
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
