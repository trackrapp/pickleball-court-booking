import { Navigate, useLocation } from "react-router-dom";
import { useAppAuth } from "../auth/AuthProvider";

function ProtectedRoute({ children }) {
  const auth = useAppAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
