import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
