const express = require("express");
const { createBooking, deleteBooking, getBookingsForUser } = require("../data/store");

const router = express.Router();

router.get("/", (request, response) => {
  const { userEmail } = request.query;

  if (!userEmail) {
    response.status(400).json({ message: "userEmail query parameter is required." });
    return;
  }

  response.json(getBookingsForUser(userEmail));
});

router.post("/", (request, response) => {
  try {
    const booking = createBooking(request.body);
    response.status(201).json(booking);
  } catch (error) {
    response.status(error.status || 500).json({ message: error.message || "Failed to create booking." });
  }
});

router.delete("/:bookingId", (request, response) => {
  const deleted = deleteBooking(request.params.bookingId);

  if (!deleted) {
    response.status(404).json({ message: "Booking not found." });
    return;
  }

  response.status(204).send();
});

module.exports = router;
