import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { cancelBooking, getBookings } from "../services/api";

function MyBookingsPage() {
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email || "";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      if (!userEmail) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getBookings(userEmail);

        if (isMounted) {
          setBookings(data);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings((currentBookings) => currentBookings.filter((booking) => booking.id !== bookingId));
    } catch (cancelError) {
      setError(cancelError.message);
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">My Bookings</span>
          <h1>Your upcoming sessions</h1>
        </div>
      </div>

      {loading ? <div className="status-card">Loading your bookings...</div> : null}
      {error ? <div className="status-card error-card">{error}</div> : null}

      {!loading && !error && !bookings.length ? (
        <div className="empty-state">
          <p>You have no active bookings yet.</p>
          <Link className="primary-button" to="/courts">
            Browse Courts
          </Link>
        </div>
      ) : null}

      {!loading && !error && bookings.length ? (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <div>
                <h2>{booking.courtName}</h2>
                <p className="muted-text">
                  {booking.date} at {booking.time}
                </p>
              </div>
              <button className="secondary-button" onClick={() => handleCancel(booking.id)}>
                Cancel
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default MyBookingsPage;
