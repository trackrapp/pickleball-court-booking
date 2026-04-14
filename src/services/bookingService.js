const STORAGE_KEY = "pickleball-bookings";

function readBookings() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    return [];
  }
}

function writeBookings(bookings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function getDateOnly(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeBooking(booking) {
  return {
    ...booking,
    date: String(booking.date),
    time: String(booking.time),
    userEmail: String(booking.userEmail || "")
  };
}

export function getAllBookings() {
  return readBookings().map(normalizeBooking).sort((left, right) => {
    const leftValue = `${left.date} ${left.time}`;
    const rightValue = `${right.date} ${right.time}`;
    return leftValue.localeCompare(rightValue);
  });
}

export function getBookingsForUser(userEmail) {
  return getAllBookings().filter((booking) => booking.userEmail === userEmail);
}

export function isSlotBooked(courtId, date, time) {
  return getAllBookings().some(
    (booking) => booking.courtId === courtId && booking.date === date && booking.time === time
  );
}

export function createBooking({ courtId, courtName, date, time, userEmail }) {
  if (!courtId || !courtName || !date || !time || !userEmail) {
    throw new Error("Booking details are incomplete. Refresh and try again.");
  }

  const today = getDateOnly(new Date());
  const requestedDate = getDateOnly(date);

  if (requestedDate < today) {
    throw new Error("Past dates cannot be booked.");
  }

  if (isSlotBooked(courtId, date, time)) {
    throw new Error("That slot has already been booked. Choose another time.");
  }

  const bookings = getAllBookings();
  const nextBooking = {
    id: `${courtId}-${date}-${time}-${Date.now()}`,
    courtId,
    courtName,
    date,
    time,
    userEmail,
    createdAt: new Date().toISOString()
  };

  bookings.push(nextBooking);
  writeBookings(bookings);

  return nextBooking;
}

export function cancelBooking(bookingId) {
  const nextBookings = getAllBookings().filter((booking) => booking.id !== bookingId);
  writeBookings(nextBookings);
}
