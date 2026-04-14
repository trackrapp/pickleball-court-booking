import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from "react-oidc-context";

const DEMO_USER_STORAGE_KEY = "pickleball-demo-user";
const AuthContext = createContext(null);

function buildDemoUser(email) {
  return {
    profile: {
      email
    }
  };
}

function readDemoEmail() {
  try {
    return window.localStorage.getItem(DEMO_USER_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
}

function writeDemoEmail(email) {
  try {
    if (email) {
      window.localStorage.setItem(DEMO_USER_STORAGE_KEY, email);
    } else {
      window.localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore localStorage write failures in demo mode.
  }
}

function DemoAuthProvider({ children }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(readDemoEmail());
  }, []);

  const authValue = useMemo(
    () => ({
      mode: "demo",
      isLoading: false,
      isAuthenticated: Boolean(email),
      error: null,
      user: email ? buildDemoUser(email) : null,
      clearStaleState: async () => {},
      signinRedirect: async ({ email: nextEmail } = {}) => {
        const normalizedEmail = String(nextEmail || "").trim().toLowerCase();

        if (!normalizedEmail) {
          throw new Error("Enter an email address to continue.");
        }

        writeDemoEmail(normalizedEmail);
        setEmail(normalizedEmail);
      },
      signoutRedirect: async () => {
        writeDemoEmail("");
        setEmail("");
      },
      removeUser: async () => {
        writeDemoEmail("");
        setEmail("");
      }
    }),
    [email]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

function OidcAuthBridge({ children }) {
  const auth = useOidcAuth();
  const authValue = useMemo(() => ({ ...auth, mode: "cognito" }), [auth]);
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function AppAuthProvider({ children }) {
  const authMode = process.env.AUTH_MODE || "demo";
  const redirectUri = process.env.COGNITO_REDIRECT_URI || window.location.origin;
  const postLogoutRedirectUri = process.env.COGNITO_LOGOUT_URI || redirectUri;
  const authority = process.env.COGNITO_AUTHORITY;
  const clientId = process.env.COGNITO_CLIENT_ID;

  if (authMode !== "cognito") {
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  if (!authority || !clientId) {
    return (
      <div className="app-shell center-screen">
        <div className="status-card error-card">
          <h1>Authentication config missing</h1>
          <p>
            Set <code>COGNITO_AUTHORITY</code> and <code>COGNITO_CLIENT_ID</code> in your local
            environment or switch <code>AUTH_MODE</code> to <code>demo</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <OidcAuthProvider
      authority={authority}
      client_id={clientId}
      redirect_uri={redirectUri}
      post_logout_redirect_uri={postLogoutRedirectUri}
      response_type="code"
      scope="phone openid email"
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      <OidcAuthBridge>{children}</OidcAuthBridge>
    </OidcAuthProvider>
  );
}

export function useAppAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAppAuth must be used within AppAuthProvider.");
  }

  return auth;
}
