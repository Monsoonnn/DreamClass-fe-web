import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to read cookies

export default function ProtectedRoute({ children }) {
  // Check for the presence of a non-HttpOnly cookie named 'isAuthenticated'
  const isAuthenticated = Cookies.get('isAuthenticated');

  if (!isAuthenticated) {
    console.log('ProtectedRoute: isAuthenticated cookie not found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: isAuthenticated cookie found, rendering children');
  return children;
}
