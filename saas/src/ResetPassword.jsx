import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Register from "./Register";
import Login from "./Login";
import RequestReset from "./RequestReset";
import ResetPassword from "./ResetPassword";
import HomeFeed from "./HomeFeed";
import { UserContext } from "./UserContext";

const backendUrl = "https://your-worker-url.workers.dev"; // Replace with your backend

export default function AppRouter() {
  const { userId, setUserId } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register backendUrl={backendUrl} />} />
        <Route path="/login" element={<Login backendUrl={backendUrl} onLogin={setUserId} />} />
        <Route path="/request-reset" element={<RequestReset backendUrl={backendUrl} />} />
        <Route path="/reset-password" element={<ResetPassword backendUrl={backendUrl} />} />
        <Route
          path="/feed"
          element={
            userId ? (
              <HomeFeed user={{ id: userId }} backendUrl={backendUrl} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}import React, { useState } from "react";

export default function ResetPassword({ backendUrl }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Password reset successful! You can now log in.");
    } else {
      setMessage(data.error || "Reset failed");
    }
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Reset Code"
          value={code}
          required
          onChange={e => setCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          required
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <div style={{ color: "red" }}>{message}</div>}
    </div>
  );
}