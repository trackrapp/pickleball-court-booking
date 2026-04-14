import { useEffect, useState } from "react";
import CourtCard from "../components/CourtCard";
import { getCourts } from "../services/api";

function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCourts() {
      try {
        const data = await getCourts();

        if (isMounted) {
          setCourts(data);
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

    loadCourts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">Available Courts</span>
          <h1>Choose where you want to play</h1>
        </div>
        <p className="muted-text">
          Explore nearby courts and jump into the next available session.
        </p>
      </div>

      {loading ? <div className="status-card">Loading courts...</div> : null}
      {error ? <div className="status-card error-card">{error}</div> : null}

      {!loading && !error ? (
        <div className="court-grid">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default CourtsPage;
