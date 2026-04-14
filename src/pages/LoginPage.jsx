import { useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function LoginPage() {
  const auth = useAuth();
  const location = useLocation();

  return (
    <section className="center-screen login-page">
      <div className="login-card">
        <span className="eyebrow">Member Access</span>
        <h1>Book your next court in minutes.</h1>
        <p>
          Browse nearby courts, pick an open time, and manage your upcoming sessions from one
          place.
        </p>
        {location.state?.from ? (
          <p className="muted-text">Sign in to continue to {location.state.from}.</p>
        ) : null}
        <button className="primary-button" onClick={() => auth.signinRedirect()}>
          Sign in with Cognito
        </button>
      </div>
    </section>
  );
}

export default LoginPage;
