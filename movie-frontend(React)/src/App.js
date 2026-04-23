import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Login from "./Login";
import PaymentPage from "./PaymentPage";
import SeatSelectionPage from "./SeatSelectionPage";
import BookingHistory from "./BookingHistory";
import AdminPanel from "./AdminPanel";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showSeatPage, setShowSeatPage] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showHistoryPage, setShowHistoryPage] = useState(false);

  const [logoutMsg, setLogoutMsg] = useState(false);
  const [bookingMsg, setBookingMsg] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isAdmin = role === "ADMIN";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token && savedRole) {
      setIsLoggedIn(true);
      setRole(savedRole);
    } else {
      setIsLoggedIn(false);
      setRole("");
    }
  }, []);

  const fetchMovies = () => {
    fetch("http://localhost:8080/api/movies", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again");
          localStorage.clear();
          setIsLoggedIn(false);
          setRole("");
          throw new Error("Session expired");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        return res.json();
      })
      .then((data) => setMovies(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMovies();
    }
  }, [isLoggedIn]);

  const filteredMovies = movies.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const openSeatSelectionPage = (movie) => {
    setSelectedMovie(movie);
    setShowSeatPage(true);
  };

  const bookTicket = (id, seats) => {
    fetch(`http://localhost:8080/api/book/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(seats),
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again");
          localStorage.clear();
          setIsLoggedIn(false);
          setRole("");
          throw new Error("Session expired");
        }

        if (!res.ok) {
          throw new Error("Booking failed");
        }

        return res.text();
      })
      .then(() => {
        setBookingMsg(true);
        fetchMovies();

        setSelectedMovie(null);
        setSelectedSeats([]);
        setShowSeatPage(false);
        setShowPaymentPage(false);

        setTimeout(() => setBookingMsg(false), 2000);
      })
      .catch((err) => console.error("Booking error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setLogoutMsg(true);

    setTimeout(() => {
      setLogoutMsg(false);
      setIsLoggedIn(false);
      setRole("");
    }, 1500);
  };

  const handleLoginSuccess = () => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole || "");
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  if (showHistoryPage) {
    return <BookingHistory onBack={() => setShowHistoryPage(false)} />;
  }

  if (showSeatPage && selectedMovie) {
    return (
      <SeatSelectionPage
        movie={selectedMovie}
        onBack={() => setShowSeatPage(false)}
        onProceedToPayment={(seats) => {
          setSelectedSeats(seats);
          setShowSeatPage(false);
          setShowPaymentPage(true);
        }}
      />
    );
  }

  if (showPaymentPage && selectedMovie) {
    return (
      <PaymentPage
        movie={selectedMovie}
        selectedSeats={selectedSeats}
        onBack={() => {
          setShowPaymentPage(false);
          setShowSeatPage(true);
        }}
        onPaymentSuccess={(movieId, seats) => {
          bookTicket(movieId, seats);
        }}
      />
    );
  }

  return (
    <div className="container">
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mp3" />
      </audio>

      <button className="music-btn" onClick={toggleMusic}>
        {isPlaying ? "⏸ Stop Music" : "▶ Play Music"}
      </button>

      {logoutMsg && <div className="logout-toast">👋 Logout Successful</div>}
      {bookingMsg && <div className="booking-toast">🎟 Ticket Booked!</div>}

      <div className="header">
        <h1>🎬 Movie Ticket Booking</h1>

        <div className="user-section">
          <p>
            Welcome, {localStorage.getItem("username")}{" "}
            {isAdmin ? "(Admin)" : "(User)"}
          </p>

          <button onClick={() => setShowHistoryPage(true)}>History</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {isAdmin && (
        <AdminPanel
          token={localStorage.getItem("token")}
          movies={movies}
          refreshMovies={fetchMovies}
        />
      )}

      <input
        type="text"
        placeholder="🔍 Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <div className="movie-grid">
        {filteredMovies.length === 0 ? (
          <p style={{ color: "white" }}>No movies found</p>
        ) : (
          filteredMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={movie.imageUrl || "https://picsum.photos/300/200"}
                alt={movie.name}
                className="poster"
              />

              <h2>{movie.name}</h2>
              <p>📍 {movie.theatre}</p>
              <p>🎟 Seats: {movie.seats}</p>
              <p>💰 Price: ₹{movie.price}</p>

              <button onClick={() => openSeatSelectionPage(movie)}>
                Book Now
              </button>

              {isAdmin && <div className="admin-mini-tag">Admin Access</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
