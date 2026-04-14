import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppAuth } from "../auth/AuthProvider";
import SlotPicker from "../components/SlotPicker";
import { createBooking, getCourt, getCourtAvailability } from "../services/api";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function CourtDetailsPage() {
  const { courtId } = useParams();
  const auth = useAppAuth();
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingCourt, setLoadingCourt] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCourt() {
      try {
        const data = await getCourt(courtId);

        if (isMounted) {
          setCourt(data);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoadingCourt(false);
        }
      }
    }

    loadCourt();

    return () => {
      isMounted = false;
    };
  }, [courtId]);

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      setLoadingSlots(true);

      try {
        const data = await getCourtAvailability(courtId, selectedDate);

        if (isMounted) {
          setSlots(data.slots);
          setSelectedSlot("");
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setSlots([]);
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoadingSlots(false);
        }
      }
    }

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [courtId, selectedDate]);

  if (loadingCourt) {
    return (
      <section className="page-section">
        <div className="status-card">Loading court details...</div>
      </section>
    );
  }

  if (!court) {
    return (
      <section className="page-section">
        <div className="empty-state">
          <h1>Court not found</h1>
          <p className="muted-text">{error || "The selected court does not exist."}</p>
          <Link className="primary-button" to="/courts">
            Back to Courts
          </Link>
        </div>
      </section>
    );
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlot("");
    setMessage("");
    setError("");
  };

  const handleConfirmBooking = async () => {
    setMessage("");
    setError("");

    if (!selectedDate || !selectedSlot) {
      setError("Select a date and time before confirming your booking.");
      return;
    }

    try {
      await createBooking({
        courtId: court.id,
        date: selectedDate,
        time: selectedSlot,
        userEmail: auth.user?.profile?.email || "unknown@example.com"
      });
      setMessage(`Booked ${court.name} on ${selectedDate} at ${selectedSlot}.`);
      setSelectedSlot("");

      const refreshedAvailability = await getCourtAvailability(courtId, selectedDate);
      setSlots(refreshedAvailability.slots);
    } catch (bookingError) {
      setError(bookingError.message);
    }
  };

  return (
    <section className="page-section">
      <Link className="text-link" to="/courts">
        Back to all courts
      </Link>

      <div className="details-layout">
        <article className="details-card">
          <div className="court-card__header">
            <span className="pill">{court.type}</span>
            <h1>{court.name}</h1>
          </div>
          <p className="court-card__facility">{court.facility}</p>
          <p className="muted-text">{court.address}</p>
          <p>{court.description}</p>
        </article>

        <aside className="booking-panel">
          <h2>Book this court</h2>
          <label className="field-label" htmlFor="booking-date">
            Select a date
          </label>
          <input
            id="booking-date"
            className="input-field"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={getTodayDate()}
          />

          <label className="field-label">Select a time</label>
          {loadingSlots ? <p className="muted-text">Loading availability...</p> : null}
          {!loadingSlots ? (
            <SlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={(slot) => {
                setSelectedSlot(slot);
                setMessage("");
                setError("");
              }}
            />
          ) : null}

          {error ? <p className="form-message form-message--error">{error}</p> : null}
          {message ? <p className="form-message form-message--success">{message}</p> : null}

          <button
            className="primary-button"
            onClick={handleConfirmBooking}
            disabled={loadingSlots || !slots.some((slot) => !slot.isBooked)}
          >
            Confirm Booking
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CourtDetailsPage;
