import React, { useState } from "react";

export default function RequestReset({ backendUrl }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetCode, setResetCode] = useState("");

  async function handleRequest(e) {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      setResetCode(data.resetCode); // For demo/testing
      setMessage("Check your email for the reset code.");
    } else {
      setMessage(data.error || "Request failed");
    }
  }

  return (
    <div>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleRequest}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Code</button>
      </form>
      {resetCode && <div>Reset code (for demo): {resetCode}</div>}
      {message && <div style={{ color: "red" }}>{message}</div>}
    </div>
  );
}