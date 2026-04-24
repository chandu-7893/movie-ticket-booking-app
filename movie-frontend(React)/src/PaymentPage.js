import React, { useState } from "react";
import "./PaymentPage.css";

function PaymentPage({ movie, selectedSeats, onBack, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [success, setSuccess] = useState(false);

  const getSeatPrice = (seat) => {
    const row = seat.charAt(0);
    return row === "A" || row === "B" ? movie.price + 100 : movie.price;
  };

  const totalAmount = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const handlePay = () => {
    if (method === "upi" && !upiId.trim()) {
      alert("Please enter UPI ID");
      return;
    }

    if (method === "netbanking" && !bank) {
      alert("Please select your bank");
      return;
    }

    if (method === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    setSuccess(true);

    setTimeout(() => {
      onPaymentSuccess(movie.id, selectedSeats);
    }, 1800);
  };

 if (success) {
  return (
    <div className="payment-page">
      <div className="success-box">
        <div className="success-icon">✅</div>
        <h1>Payment Successful</h1>
        <p>Generating your ticket...</p>
      </div>
    </div>
  );
}

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1>Complete Payment</h1>

        <div className="movie-summary">
          <h2>{movie.name}</h2>
          <p>📍 {movie.theatre}</p>
          <p>🎟 Seats: {selectedSeats.join(", ")}</p>
          <h3>Total: ₹{totalAmount}</h3>
        </div>

        {/* PAYMENT TABS */}
        <div className="payment-tabs">
          <button
            className={method === "upi" ? "active" : ""}
            onClick={() => setMethod("upi")}
          >
            UPI
          </button>

          <button
            className={method === "netbanking" ? "active" : ""}
            onClick={() => setMethod("netbanking")}
          >
            NetBanking
          </button>

          <button
            className={method === "card" ? "active" : ""}
            onClick={() => setMethod("card")}
          >
            Card
          </button>
        </div>

        {/* UPI */}
        {method === "upi" && (
          <div className="payment-form">
            <label>UPI ID</label>
            <input
              type="text"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />

            <div className="upi-box">
              <p>Scan & Pay</p>
              <div className="qr">QR</div>
            </div>
          </div>
        )}

        {/* NETBANKING */}
        {method === "netbanking" && (
          <div className="payment-form">
            <label>Select Bank</label>

            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="bank-select"
            >
              <option value="">Choose your bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
              <option value="KOTAK">Kotak Mahindra Bank</option>
              <option value="CANARA">Canara Bank</option>
            </select>

            <div className="netbanking-box">
              <h3>🏦 Secure NetBanking</h3>
              <p>
                Selected Bank: <strong>{bank || "Not selected"}</strong>
              </p>
              <p className="secure-text">
                🔒 You will be redirected to bank login page
              </p>
            </div>
          </div>
        )}

        {/* CARD */}
        {method === "card" && (
          <div className="payment-form">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              value={card.number}
              onChange={(e) =>
                setCard({ ...card, number: e.target.value })
              }
            />

            <label>Card Holder Name</label>
            <input
              type="text"
              placeholder="CHANDU REDDY"
              value={card.name}
              onChange={(e) =>
                setCard({ ...card, name: e.target.value })
              }
            />

            <div className="row-inputs">
              <div>
                <label>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({ ...card, expiry: e.target.value })
                  }
                />
              </div>

              <div>
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength="3"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard({ ...card, cvv: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="payment-buttons">
          <button className="pay-btn" onClick={handlePay}>
            Pay ₹{totalAmount}
          </button>

          <button className="back-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;