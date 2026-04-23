import React, { useState } from "react";
import "./Register.css";

function Register({ onBackToLogin }) {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const handleRegister = async () => {
    if (!user.username || !user.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert(data.message);
      onBackToLogin();
    } catch (error) {
      console.error("Register error:", error);
      alert("Failed to connect to server");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>🎬 Register</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={user.username}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Enter password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
        />

        <button onClick={handleRegister}>Register</button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={onBackToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;