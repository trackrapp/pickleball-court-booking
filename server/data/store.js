const courts = require("./courts");

const DAILY_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
];

const bookings = [];

function isValidDate(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

function getCourtById(courtId) {
  return courts.find((court) => court.id === courtId);
}

function getBookingsForUser(userEmail) {
  return bookings
    .filter((booking) => booking.userEmail === userEmail)
    .sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`));
}

function getBookedSlots(courtId, date) {
  return bookings
    .filter((booking) => booking.courtId === courtId && booking.date === date)
    .map((booking) => booking.time);
}

function getAvailability(courtId, date) {
  const bookedSlots = getBookedSlots(courtId, date);

  return DAILY_SLOTS.map((time) => ({
    time,
    isBooked: bookedSlots.includes(time)
  }));
}

function createBooking({ courtId, date, time, userEmail }) {
  const court = getCourtById(courtId);

  if (!court) {
    const error = new Error("Court not found.");
    error.status = 404;
    throw error;
  }

  if (!userEmail || !date || !time) {
    const error = new Error("courtId, date, time, and userEmail are required.");
    error.status = 400;
    throw error;
  }

  if (!isValidDate(date)) {
    const error = new Error("Date must use YYYY-MM-DD format.");
    error.status = 400;
    throw error;
  }

  if (!DAILY_SLOTS.includes(time)) {
    const error = new Error("Time is not part of the booking schedule.");
    error.status = 400;
    throw error;
  }

  const isTaken = bookings.some(
    (booking) => booking.courtId === courtId && booking.date === date && booking.time === time
  );

  if (isTaken) {
    const error = new Error("That slot is already booked.");
    error.status = 409;
    throw error;
  }

  const booking = {
    id: `${courtId}-${date}-${time}-${Date.now()}`,
    courtId,
    courtName: court.name,
    date,
    time,
    userEmail,
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);

  return booking;
}

function deleteBooking(bookingId) {
  const index = bookings.findIndex((booking) => booking.id === bookingId);

  if (index === -1) {
    return false;
  }

  bookings.splice(index, 1);
  return true;
}

module.exports = {
  DAILY_SLOTS,
  courts,
  getCourtById,
  getBookingsForUser,
  getAvailability,
  createBooking,
  deleteBooking
};
