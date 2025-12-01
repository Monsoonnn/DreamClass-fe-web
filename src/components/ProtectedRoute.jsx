import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  useEffect(() => {
    console.log('========== ProtectedRoute Cookie Check ==========');

    // Log toàn bộ document.cookie
    console.log('document.cookie:', document.cookie);

    // Check xem có connect.sid không
    const cookies = document.cookie.split(';').map((c) => c.trim());
    console.log('Parsed cookies:', cookies);

    const connectSidCookie = cookies.find((c) => c.startsWith('connect.sid='));
    console.log('connect.sid cookie found:', connectSidCookie);

    // Check từng cookie
    cookies.forEach((cookie, index) => {
      const [name, value] = cookie.split('=');
      console.log(`Cookie ${index + 1}: name="${name}", value="${value?.substring(0, 20)}..."`);
    });

    console.log('==============================================');
  }, []);

  // Check xem có connect.sid cookie không
  const cookies = document.cookie.split(';').map((c) => c.trim());
  const connectSidCookie = cookies.find((c) => c.startsWith('connect.sid='));

  if (!connectSidCookie) {
    console.log('ProtectedRoute: connect.sid cookie not found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: connect.sid found, rendering children');
  return children;
}
