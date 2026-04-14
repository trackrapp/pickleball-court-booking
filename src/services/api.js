const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function getCourts() {
  return request("/api/courts");
}

export function getCourt(courtId) {
  return request(`/api/courts/${courtId}`);
}

export function getCourtAvailability(courtId, date) {
  return request(`/api/courts/${courtId}/availability?date=${encodeURIComponent(date)}`);
}

export function getBookings(userEmail) {
  return request(`/api/bookings?userEmail=${encodeURIComponent(userEmail)}`);
}

export function createBooking(booking) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(booking)
  });
}

export function cancelBooking(bookingId) {
  return request(`/api/bookings/${bookingId}`, {
    method: "DELETE"
  });
}
