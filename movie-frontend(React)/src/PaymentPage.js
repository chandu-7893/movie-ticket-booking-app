import React, { useState } from "react";
import "./PaymentPage.css";

function PaymentPage({ movie, selectedSeats, onBack, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // UPI
  const [upiId, setUpiId] = useState("");

  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Net Banking
  const [selectedBank, setSelectedBank] = useState("");

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
  ];

  const getSeatPrice = (seat) => {
    const row = seat.charAt(0);
    return row === "A" || row === "B" ? movie.price + 100 : movie.price;
  };

  const totalAmount = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validate = () => {
    if (paymentMethod === "UPI") {
      if (!upiId.match(/^[\w.-]{2,}@[a-zA-Z]{2,}$/)) {
        setError("Enter a valid UPI ID (e.g. name@upi)");
        return false;
      }
    } else if (paymentMethod === "Card") {
      if (cardHolder.trim().length < 3) {
        setError("Enter cardholder name.");
        return false;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Enter a valid 16-digit card number.");
        return false;
      }
      if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        setError("Enter a valid expiry (MM/YY).");
        return false;
      }
      if (cvv.length !== 3) {
        setError("Enter a valid 3-digit CVV.");
        return false;
      }
    } else if (paymentMethod === "Net Banking") {
      if (!selectedBank) {
        setError("Please select a bank.");
        return false;
      }
    }
    return true;
  };

  const handlePayment = () => {
    setError("");
    if (!validate()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(movie.id, selectedSeats);
      }, 1500);
    }, 2500);
  };

  return (
    <div className="payment-page">
      <div className="payment-box">
        <h2>💳 Payment Page</h2>

        <p><strong>Movie:</strong> {movie.name}</p>
        <p><strong>Theatre:</strong> {movie.theatre}</p>
        <p><strong>Selected Seats:</strong> {selectedSeats.join(", ")}</p>

        <div className="seat-price-list">
          <h3>Seat Details</h3>
          {selectedSeats.map((seat, index) => (
            <p key={index}>
              {seat} - ₹{getSeatPrice(seat)}{" "}
              {seat.startsWith("A") || seat.startsWith("B") ? "(VIP)" : "(Regular)"}
            </p>
          ))}
        </div>

        <h3>Total Amount: ₹{totalAmount}</h3>

        {/* Payment Method Selection */}
        <div className="payment-methods">
          {["UPI", "Card", "Net Banking"].map((method) => (
            <label key={method}>
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setError("");
                }}
                disabled={processing || success}
              />
              {method}
            </label>
          ))}
        </div>

        {/* UPI Fields */}
        {paymentMethod === "UPI" && (
          <div className="payment-fields">
            <label>UPI ID</label>
            <input
              type="text"
              placeholder="e.g. yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              disabled={processing || success}
            />
          </div>
        )}

        {/* Card Fields */}
        {paymentMethod === "Card" && (
          <div className="payment-fields">
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="Name on card"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              disabled={processing || success}
            />

            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              disabled={processing || success}
            />

            <div className="card-row">
              <div>
                <label>Expiry (MM/YY)</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={processing || success}
                />
              </div>
              <div>
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  maxLength={3}
                  disabled={processing || success}
                />
              </div>
            </div>
          </div>
        )}

        {/* Net Banking Fields */}
        {paymentMethod === "Net Banking" && (
          <div className="payment-fields">
            <label>Select Bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              disabled={processing || success}
            >
              <option value="">-- Choose your bank --</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="payment-error">⚠️ {error}</p>}

        {processing && (
          <div className="payment-status processing">
            <div className="spinner"></div>
            <p>Processing your payment via {paymentMethod}...</p>
          </div>
        )}

        {success && (
          <div className="payment-status success">
            <p>✅ Payment Successful! Booking your seats...</p>
          </div>
        )}

        {!success && (
          <div className="payment-btn-group">
            <button onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : "Pay Now"}
            </button>
            <button onClick={onBack} className="back-btn" disabled={processing}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;