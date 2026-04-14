const express = require("express");
const courtsRouter = require("./routes/courts");
const bookingsRouter = require("./routes/bookings");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/courts", courtsRouter);
app.use("/api/bookings", bookingsRouter);

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
