import { Fragment, useState } from "react";
import "./SeatSelectionPage.css";

const MAX_SEATS = 6;

function SeatSelectionPage({ movie, onBack, onProceedToPayment }) {
  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  const bookedSeats = movie.bookedSeats
    ? movie.bookedSeats.split(",").filter(Boolean)
    : [];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const seatCount = selectedSeats.length;
  const selectedSeatText = selectedSeats.join(", ") || "None";

  const getSeatType = (row) => {
    if (row === "A" || row === "B") return "vip";
    return "regular";
  };

  const getSeatPrice = (row) => {
    if (row === "A" || row === "B") return movie.price + 100;
    return movie.price;
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        alert(`You can only select up to ${MAX_SEATS} seats at a time.`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalAmount = selectedSeats.reduce((total, seat) => {
    const row = seat.charAt(0);
    return total + getSeatPrice(row);
  }, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    onProceedToPayment(selectedSeats);
  };

  return (
    <div className="seat-page">
      <div className="seat-box">
        <div className="seat-header">
          <p className="seat-kicker">Choose your experience</p>
          <h2>Select Seats for {movie.name}</h2>
          <p className="seat-theatre">Theatre: {movie.theatre}</p>
        </div>

        {/* Max seat limit notice */}
        <div className="max-limit-banner">
          ⚠️ Max <strong>{MAX_SEATS}</strong> seats allowed per booking &nbsp;|&nbsp;
          Selected: <strong>{seatCount} / {MAX_SEATS}</strong>
        </div>

        <div className="price-cards">
          <div className="price-card regular-card">
            <span className="price-label">Regular</span>
            <strong>₹{movie.price}</strong>
          </div>
          <div className="price-card vip-card">
            <span className="price-label">VIP</span>
            <strong>₹{movie.price + 100}</strong>
          </div>
        </div>

        <div className="legend-wrap">
          <div className="legend">
            <div className="legend-item">
              <span className="seat-demo regular"></span>
              <span>Regular</span>
            </div>
            <div className="legend-item">
              <span className="seat-demo vip"></span>
              <span>VIP</span>
            </div>
            <div className="legend-item">
              <span className="seat-demo selected"></span>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <span className="seat-demo booked"></span>
              <span>Booked</span>
            </div>
          </div>
        </div>

        <div className="screen-wrap">
          <div className="screen-arc"></div>
          <div className="screen-glow"></div>
          <div className="screen-beam left"></div>
          <div className="screen-beam right"></div>
          <div className="screen">SCREEN</div>
          <p className="screen-note">Best view from the center rows</p>
        </div>

        <div className="seat-layout">
          {rows.map((row) => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>

              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seat = `${row}${i + 1}`;
                const isBooked = bookedSeats.includes(seat);
                const isSelected = selectedSeats.includes(seat);
                const seatType = getSeatType(row);
                const isDisabled =
                  isBooked || (!isSelected && selectedSeats.length >= MAX_SEATS);

                return (
                  <Fragment key={seat}>
                    {i === 4 && <div className="aisle-gap"></div>}
                    <button
                      className={`seat ${seatType} ${
                        isBooked
                          ? "booked"
                          : isSelected
                          ? "selected"
                          : isDisabled
                          ? "dimmed"
                          : ""
                      }`}
                      disabled={isDisabled}
                      onClick={() => toggleSeat(seat)}
                      title={
                        isBooked
                          ? "Already booked"
                          : isDisabled
                          ? `Max ${MAX_SEATS} seats allowed`
                          : seat
                      }
                    >
                      {seat}
                    </button>
                  </Fragment>
                );
              })}
            </div>
          ))}
        </div>

        <div className="seat-summary">
          <div className="summary-card">
            <span className="summary-label">Selected Seats</span>
            <strong>{selectedSeatText}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tickets</span>
            <strong>{seatCount} / {MAX_SEATS}</strong>
          </div>
          <div className="summary-card total-card">
            <span className="summary-label">Total Amount</span>
            <strong>₹{totalAmount}</strong>
          </div>
        </div>

        <div className="seat-btn-group">
          <button onClick={handleProceed} className="primary-btn">
            Proceed to Payment
          </button>
          <button onClick={onBack} className="back-btn">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;