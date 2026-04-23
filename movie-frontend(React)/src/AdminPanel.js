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

  const showToast = (message, type = "error") => {
    setToastMsg(message);
    setToastType(type);
    setTimeout(() => {
      setToastMsg("");
      setToastType("");
    }, 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const clearForm = () => {
    setNewMovie(emptyMovie);
    setEditMovieId(null);
  };

  const handleSessionExpired = () => {
    showToast("Session expired. Please login again", "error");
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1200);
  };

  const addMovie = () => {
    if (!newMovie.name || !newMovie.theatre || !newMovie.seats || !newMovie.price) {
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

        if (!res.ok) {
          throw new Error("Failed to add movie");
        }

        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie added successfully", "success");
        clearForm();
        refreshMovies();
      })
      .catch((err) => {
        console.error(err);
        showToast("Error adding movie", "error");
      });
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateMovie = () => {
    if (!newMovie.name || !newMovie.theatre || !newMovie.seats || !newMovie.price) {
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

        if (!res.ok) {
          throw new Error("Failed to update movie");
        }

        return res.json();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie updated successfully", "success");
        clearForm();
        refreshMovies();
      })
      .catch((err) => {
        console.error(err);
        showToast("Error updating movie", "error");
      });
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

        if (!res.ok) {
          throw new Error("Failed to delete movie");
        }

        return res.text();
      })
      .then((data) => {
        if (data === null) return;
        showToast("Movie deleted successfully", "success");
        setShowConfirm(false);
        setDeleteId(null);
        refreshMovies();
      })
      .catch((err) => {
        console.error(err);
        showToast("Error deleting movie", "error");
      });
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <>
      {toastMsg && (
        <div className={toastType === "success" ? "toast-success" : "toast-error"}>
          {toastMsg}
        </div>
      )}

      <div className="admin-wrapper">
        <div className="admin-panel">
          <h2>{editMovieId ? "Edit Movie" : "Add Movie📽️"}</h2>

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

        <div className="movie-manage-section">
          <h3 className="manage-title">Manage Movies</h3>

          <div className="manage-grid">
            {movies.length === 0 ? (
              <p className="empty-text">No movies available</p>
            ) : (
              movies.map((movie) => (
                <div className="manage-card" key={movie.id}>
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
              ))
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
                <button className="confirm-cancel" onClick={cancelDelete}>
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