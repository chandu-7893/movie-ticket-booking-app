import React, { useEffect, useState } from "react";
import "./BookingHistory.css";

function BookingHistory({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/bookings", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Bookings from backend:", data);
        setBookings(data);
      })
      .catch((err) => {
        console.error("Booking fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="history-container">
      <h2>🎟 My Bookings</h2>

      <button className="back-btn" onClick={onBack}>
        ⬅ Back
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b, index) => (
          <div key={index} className="history-card">
            <h3>{b.movieName}</h3>
            <p>📍 {b.theatre}</p>
            <p>🎟 Seats: {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</p>
            <p>💰 ₹{b.totalPrice}</p>
            <p>👤 {b.username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingHistory;