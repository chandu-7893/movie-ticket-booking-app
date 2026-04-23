import React, { useState } from "react";
import "./Login.css";
import Register from "./Register";

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!user.username || !user.password) {
      setErrorMsg("Please fill all fields");
      setTimeout(() => setErrorMsg(""), 2500);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Invalid username or password");
        setTimeout(() => setErrorMsg(""), 2500);
        return;
      }

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("username", data.username || user.username);
      localStorage.setItem("role", data.role || "");

      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Failed to fetch");
      setTimeout(() => setErrorMsg(""), 2500);
    }
  };

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {errorMsg && <div className="error-toast">❌ {errorMsg}</div>}

        <h2>🎬 Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
        />

        <button onClick={handleLogin}>Login</button>

        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={() => setShowRegister(true)}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;