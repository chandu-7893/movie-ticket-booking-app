import React, { useState } from "react";
import "./AdminPanel.css";

function AdminPanel({ token, movies, refreshMovies }) {
  const emptyMovie = {
    name: "",
    theatre: "",
    seats: "",
    imageUrl: "",
    price: "",
  };

  const [newMovie, setNewMovie] = useState(emptyMovie);
  const [editMovieId, setEditMovieId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("");

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  const showToast = (message, type = "error") => {
    setToastMsg(message);
    setToastType(type);
    setTimeout(() => {
      setToastMsg("");
      setToastType("");
    }, 2500);
  };

  const handleSessionExpired = () => {
    showToast("Session expired. Please login again", "error");
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1200);
  };

  const handleChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setNewMovie(emptyMovie);
    setEditMovieId(null);
  };

  const getSeatStatus = (movie, seat) => {
    const bookedSeats = movie.bookedSeats
      ? movie.bookedSeats.split(",").filter(Boolean)
      : [];

    const lockedSeats = movie.lockedSeats
      ? movie.lockedSeats.split(",").filter(Boolean)
      : [];

    if (bookedSeats.includes(seat)) return "booked";
    if (lockedSeats.includes(seat)) return "locked";
    return "available";
  };

  const addMovie = () => {
    if (
      !newMovie.name ||
      !newMovie.theatre ||
      !newMovie.seats ||
      !newMovie.price
    ) {
      showToast("Please fill all fields", "error");
      return;
    }

    fetch("http://localhost:8080/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newMovie),
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired();
          return null;
        }
        if (!res.ok) throw new Error("Failed to add movie");
        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie added successfully", "success");
        clearForm();
        refreshMovies();
      })
      .catch(() => showToast("Error adding movie", "error"));
  };

  const editMovie = (movie) => {
    setEditMovieId(movie.id);
    setNewMovie({
      name: movie.name || "",
      theatre: movie.theatre || "",
      seats: movie.seats || "",
      imageUrl: movie.imageUrl || "",
      price: movie.price || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateMovie = () => {
    if (
      !newMovie.name ||
      !newMovie.theatre ||
      !newMovie.seats ||
      !newMovie.price
    ) {
      showToast("Please fill all fields", "error");
      return;
    }

    fetch(`http://localhost:8080/api/update/${editMovieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newMovie),
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired();
          return null;
        }
        if (!res.ok) throw new Error("Failed to update movie");
        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie updated successfully", "success");
        clearForm();
        refreshMovies();
      })
      .catch(() => showToast("Error updating movie", "error"));
  };

  const deleteMovie = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8080/api/delete/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired();
          return null;
        }
        if (!res.ok) throw new Error("Failed to delete movie");
        return res.text();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie deleted successfully", "success");
        setShowConfirm(false);
        setDeleteId(null);
        refreshMovies();
      })
      .catch(() => showToast("Error deleting movie", "error"));
  };

  const unlockSeat = (movieId, seat) => {
    fetch(`http://localhost:8080/api/admin/unlock/${movieId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify([seat]),
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired();
          return null;
        }
        if (!res.ok) throw new Error("Failed to unlock seat");
        return res.text();
      })
      .then((data) => {
        if (data === null) return;
        showToast(`${seat} unlocked successfully`, "success");
        refreshMovies();
      })
      .catch(() => showToast("Error unlocking seat", "error"));
  };

  const removeBookedSeat = (movieId, seat) => {
    fetch(`http://localhost:8080/api/admin/remove-booked/${movieId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify([seat]),
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired();
          return null;
        }
        if (!res.ok) throw new Error("Failed to remove booked seat");
        return res.text();
      })
      .then((data) => {
        if (data === null) return;
        showToast(`${seat} removed from booked seats`, "success");
        refreshMovies();
      })
      .catch(() => showToast("Error removing booked seat", "error"));
  };

  const totalMovies = movies.length;

  const totalSeats = movies.reduce(
    (sum, movie) => sum + Number(movie.seats || 0),
    0,
  );

  const totalBooked = movies.reduce((sum, movie) => {
    const count = movie.bookedSeats
      ? movie.bookedSeats.split(",").filter(Boolean).length
      : 0;
    return sum + count;
  }, 0);

  const totalLocked = movies.reduce((sum, movie) => {
    const count = movie.lockedSeats
      ? movie.lockedSeats.split(",").filter(Boolean).length
      : 0;
    return sum + count;
  }, 0);

  const totalAvailable = totalSeats - totalBooked - totalLocked;

  const totalRevenue = movies.reduce((sum, movie) => {
    const bookedCount = movie.bookedSeats
      ? movie.bookedSeats.split(",").filter(Boolean).length
      : 0;
    return sum + bookedCount * Number(movie.price || 0);
  }, 0);

  return (
    <>
      {toastMsg && (
        <div
          className={toastType === "success" ? "toast-success" : "toast-error"}
        >
          {toastMsg}
        </div>
      )}

      <div className="admin-wrapper">
        <div className="admin-panel">
          <h2>{editMovieId ? "Edit Movie" : "Add Movie 📽️"}</h2>

          <div className="admin-form">
            <div className="input-group">
              <label>Movie Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter movie name"
                value={newMovie.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Theatre</label>
              <input
                type="text"
                name="theatre"
                placeholder="Enter theatre name"
                value={newMovie.theatre}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Total Seats</label>
              <input
                type="number"
                name="seats"
                placeholder="Enter seats"
                value={newMovie.seats}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter ticket price"
                value={newMovie.price}
                onChange={handleChange}
              />
            </div>

            <div className="input-group full-width">
              <label>Image URL</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="Paste poster image URL"
                value={newMovie.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="admin-actions">
              <button
                className="admin-btn"
                onClick={editMovieId ? updateMovie : addMovie}
              >
                {editMovieId ? "Update Movie" : "Add Movie"}
              </button>

              <button className="admin-btn secondary" onClick={clearForm}>
                Clear
              </button>
            </div>
          </div>

          <p className="admin-note">Manage your movie collection with style.</p>
        </div>

        <div className="pro-dashboard">
          <h2>📊 Admin Dashboard</h2>

          <div className="dashboard-cards">
            <div className="dash-card">
              <span>🎬</span>
              <h3>{totalMovies}</h3>
              <p>Total Movies</p>
            </div>

            <div className="dash-card">
              <span>💺</span>
              <h3>{totalSeats}</h3>
              <p>Total Seats</p>
            </div>

            <div className="dash-card booked">
              <span>🎟</span>
              <h3>{totalBooked}</h3>
              <p>Booked Seats</p>
            </div>

            <div className="dash-card locked">
              <span>🔒</span>
              <h3>{totalLocked}</h3>
              <p>Locked Seats</p>
            </div>

            <div className="dash-card available">
              <span>✅</span>
              <h3>{totalAvailable}</h3>
              <p>Available Seats</p>
            </div>

            <div className="dash-card revenue">
              <span>💰</span>
              <h3>₹{totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="movie-manage-section">
          <h3 className="manage-title">Manage Movies</h3>

          <div className="manage-grid">
            {movies.length === 0 ? (
              <p className="empty-text">No movies available</p>
            ) : (
              movies.map((movie) => {
                const bookedCount = movie.bookedSeats
                  ? movie.bookedSeats.split(",").filter(Boolean).length
                  : 0;

                const lockedCount = movie.lockedSeats
                  ? movie.lockedSeats.split(",").filter(Boolean).length
                  : 0;

                const availableCount =
                  Number(movie.seats) - bookedCount - lockedCount;

                return (
                  <div className="manage-card pro-card" key={movie.id}>
                    <img
                      src={movie.imageUrl || "https://picsum.photos/300/200"}
                      alt={movie.name}
                      className="manage-poster"
                    />

                    <div className="manage-content">
                      <h4>{movie.name}</h4>
                      <p>📍 {movie.theatre}</p>
                      <p>🎟 Seats: {movie.seats}</p>
                      <p>💰 Price: ₹{movie.price}</p>
                    </div>

                    <div className="seat-stats">
                      <div>
                        <h4>{movie.seats}</h4>
                        <p>Total</p>
                      </div>

                      <div>
                        <h4>{bookedCount}</h4>
                        <p>Booked</p>
                      </div>

                      <div>
                        <h4>{lockedCount}</h4>
                        <p>Locked</p>
                      </div>

                      <div>
                        <h4>{availableCount}</h4>
                        <p>Available</p>
                      </div>
                    </div>

                    <div className="admin-seat-map">
                      <h5>🎟 Visual Seat Map</h5>

                      <div className="seat-map-legend">
                        <span>🟢 Available</span>
                        <span>🔴 Booked</span>
                        <span>🟡 Locked</span>
                      </div>

                      <div className="admin-screen">SCREEN</div>

                      <div className="seat-scroll-area">
                        <div className="admin-seat-grid">
                          {rows.map((row) => (
                            <div className="admin-seat-row" key={row}>
                              <span className="admin-row-label">{row}</span>

                              {Array.from({ length: seatsPerRow }, (_, i) => {
                                const seat = `${row}${i + 1}`;
                                const status = getSeatStatus(movie, seat);

                                return (
                                  <React.Fragment key={seat}>
                                    {i === 4 && (
                                      <div className="center-aisle"></div>
                                    )}

                                    <button
                                      className={`admin-seat ${status}`}
                                      onClick={() => {
                                        if (status === "locked") {
                                          unlockSeat(movie.id, seat);
                                        } else if (status === "booked") {
                                          removeBookedSeat(movie.id, seat);
                                        }
                                      }}
                                      title={
                                        status === "locked"
                                          ? "Click to unlock seat"
                                          : status === "booked"
                                            ? "Click to remove booked seat"
                                            : "Available seat"
                                      }
                                    >
                                      {seat}
                                    </button>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="seat-map-note">
                        Click 🔴 booked seats to remove booking, click 🟡 locked
                        seats to unlock.
                      </p>
                    </div>

                    <div className="manage-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => editMovie(movie)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteMovie(movie.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3>Delete Movie?</h3>
              <p>Are you sure you want to delete this movie?</p>

              <div className="confirm-buttons">
                <button className="confirm-delete" onClick={confirmDelete}>
                  Yes, Delete
                </button>

                <button
                  className="confirm-cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminPanel;
