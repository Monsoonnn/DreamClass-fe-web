import { Navigate } from 'react-router-dom';
// import { useEffect } from 'react'; // No longer needed if we only check localStorage

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user'); // Check for user in localStorage

  if (!user) {
    console.log('ProtectedRoute: User not found in localStorage, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: User found in localStorage, rendering children');
  return children;
}
