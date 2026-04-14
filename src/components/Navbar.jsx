import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signoutRedirect();
    } catch (error) {
      await auth.removeUser();
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="brand-mark">PB</span>
        <div>
          <div className="navbar__title">Pickleball Court Booking</div>
          <div className="navbar__subtitle">{auth.user?.profile?.email}</div>
        </div>
      </div>
      <nav className="navbar__links" aria-label="Main navigation">
        <NavLink
          to="/courts"
          className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
        >
          Courts
        </NavLink>
        <NavLink
          to="/bookings"
          className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
        >
          My Bookings
        </NavLink>
        <button className="secondary-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
