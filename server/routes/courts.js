const express = require("express");
const { courts, getCourtById, getAvailability } = require("../data/store");

const router = express.Router();

router.get("/", (_request, response) => {
  response.json(courts);
});

router.get("/:courtId", (request, response) => {
  const court = getCourtById(request.params.courtId);

  if (!court) {
    response.status(404).json({ message: "Court not found." });
    return;
  }

  response.json(court);
});

router.get("/:courtId/availability", (request, response) => {
  const court = getCourtById(request.params.courtId);

  if (!court) {
    response.status(404).json({ message: "Court not found." });
    return;
  }

  const { date } = request.query;

  if (!date) {
    response.status(400).json({ message: "date query parameter is required." });
    return;
  }

  response.json({
    courtId: court.id,
    date,
    slots: getAvailability(court.id, date)
  });
});

module.exports = router;
