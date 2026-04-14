import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CourtsPage from "./pages/CourtsPage";
import CourtDetailsPage from "./pages/CourtDetailsPage";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import "./styles.css";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="app-shell center-screen">
        <div className="status-card">Loading your account...</div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="app-shell center-screen">
        <div className="status-card error-card">
          <h1>Authentication error</h1>
          <p>{auth.error.message}</p>
          <button className="primary-button" onClick={() => auth.clearStaleState()}>
            Reset session state
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {auth.isAuthenticated ? <Navbar /> : null}
      <main className="page-shell">
        <Routes>
          <Route
            path="/"
            element={auth.isAuthenticated ? <Navigate to="/courts" replace /> : <LoginPage />}
          />
          <Route
            path="/courts"
            element={
              <ProtectedRoute>
                <CourtsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courts/:courtId"
            element={
              <ProtectedRoute>
                <CourtDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={auth.isAuthenticated ? "/courts" : "/"} replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
