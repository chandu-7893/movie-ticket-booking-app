import React from "react";
import "./TicketConfirmation.css";

function TicketConfirmation({ movie, selectedSeats, totalAmount, onHome }) {
  const bookingId = "BK" + Date.now();

  const bookingDate = new Date().toLocaleDateString();
  const bookingTime = new Date().toLocaleTimeString();

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-header">
          <h1>🎟 Booking Confirmed</h1>
          <p>Your movie ticket is ready!</p>
        </div>

        <div className="ticket-body">
          <div className="ticket-left">
            <img
              src={movie.imageUrl || "https://picsum.photos/200/300"}
              alt={movie.name}
              className="ticket-poster"
            />

            <h2>{movie.name}</h2>
            <p>📍 Theatre: {movie.theatre}</p>
            <p>💺 Seats: {selectedSeats.join(", ")}</p>
            <p>💰 Amount Paid: ₹{totalAmount}</p>
            <p>🧾 Booking ID: {bookingId}</p>
            <p>🗓 Date: {bookingDate}</p>
            <p>⏰ Time: {bookingTime}</p>
          </div>

          <div className="ticket-right">
            <div className="qr-box">QR</div>
            <p>Show this ticket at entry</p>

            <div className="barcode"></div>
            <small>{bookingId}</small>
          </div>
        </div>

        <div className="ticket-footer">
          <span>Enjoy your movie 🍿</span>
          <button onClick={onHome}>Go Home</button>
        </div>
      </div>
    </div>
  );
}

export default TicketConfirmation;