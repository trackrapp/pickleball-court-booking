import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppAuth } from "../auth/AuthProvider";

function LoginPage() {
  const auth = useAppAuth();
  const location = useLocation();
  const [email, setEmail] = useState("player@example.com");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      setError("");

      if (auth.mode === "demo") {
        await auth.signinRedirect({ email });
        return;
      }

      await auth.signinRedirect();
    } catch (signinError) {
      setError(signinError.message || "Sign-in failed.");
    }
  };

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
        {auth.mode === "demo" ? (
          <>
            <label className="field-label" htmlFor="demo-email">
              Demo email
            </label>
            <input
              id="demo-email"
              className="input-field"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="player@example.com"
            />
            <p className="muted-text">
              Demo mode skips Cognito so you can test the booking flow locally.
            </p>
          </>
        ) : null}
        {error ? <p className="form-message form-message--error">{error}</p> : null}
        <button className="primary-button" onClick={handleSignIn}>
          {auth.mode === "demo" ? "Continue in Demo Mode" : "Sign in with Cognito"}
        </button>
      </div>
    </section>
  );
}

export default LoginPage;
