import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import App from "./App";

const redirectUri = process.env.COGNITO_REDIRECT_URI || window.location.origin;
const postLogoutRedirectUri = process.env.COGNITO_LOGOUT_URI || redirectUri;
const authority = process.env.COGNITO_AUTHORITY;
const clientId = process.env.COGNITO_CLIENT_ID;

function MissingAuthConfig() {
  return (
    <div className="app-shell center-screen">
      <div className="status-card error-card">
        <h1>Authentication config missing</h1>
        <p>
          Set <code>COGNITO_AUTHORITY</code> and <code>COGNITO_CLIENT_ID</code> in your local
          environment before starting the app.
        </p>
      </div>
    </div>
  );
}

const cognitoAuthConfig = {
  authority,
  client_id: clientId,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: "code",
  scope: "phone openid email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));

if (!authority || !clientId) {
  root.render(
    <React.StrictMode>
      <MissingAuthConfig />
    </React.StrictMode>
  );
} else {
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
}
