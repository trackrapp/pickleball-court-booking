function SlotPicker({ slots, selectedSlot, onSelect }) {
  if (!slots.length) {
    return <p className="muted-text">No available slots for the selected date.</p>;
  }

  return (
    <div className="slot-grid" role="list" aria-label="Available booking slots">
      {slots.map((slot) => {
        const isBooked = slot.isBooked;
        const isSelected = selectedSlot === slot.time;

        return (
          <button
            key={slot.time}
            type="button"
            className={`slot-button${isSelected ? " slot-button--selected" : ""}`}
            onClick={() => onSelect(slot.time)}
            disabled={isBooked}
            aria-pressed={isSelected}
            aria-label={`${slot.time} ${isBooked ? "booked" : "available"}`}
          >
            <span>{slot.time}</span>
            <span className="slot-button__status">{isBooked ? "Booked" : "Available"}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SlotPicker;
