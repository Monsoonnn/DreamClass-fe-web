export default function ProtectedRoute({ children }) {
  // Rely on API interceptors to handle 401 Unauthorized redirects.
  // Since session cookies are HttpOnly, we cannot check them client-side.
  return children;
}
