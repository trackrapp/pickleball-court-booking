import { Link } from "react-router-dom";

function CourtCard({ court }) {
  return (
    <article className="court-card">
      <div className="court-card__header">
        <span className="pill">{court.type}</span>
        <h2>{court.name}</h2>
      </div>
      <p className="court-card__facility">{court.facility}</p>
      <p className="muted-text">{court.address}</p>
      {court.description ? <p>{court.description}</p> : null}
      <Link className="primary-button" to={`/courts/${court.id}`}>
        View Availability
      </Link>
    </article>
  );
}

export default CourtCard;
