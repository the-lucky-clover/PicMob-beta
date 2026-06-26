import React, { useState } from "react";

export default function Register({ backendUrl }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setVerifyCode(data.verifyCode); // For demo/testing
      setStep(2);
    } else {
      setMessage(data.error || "Registration failed");
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const res = await fetch(`${backendUrl}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: verifyCode }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Email verified! You can now log in.");
      setStep(3);
    } else {
      setMessage(data.error || "Verification failed");
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {step === 1 && (
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerify}>
          <p>Check your email for a verification code.</p>
          <input
            type="text"
            placeholder="Verification Code"
            value={verifyCode}
            required
            onChange={e => setVerifyCode(e.target.value)}
          />
          <button type="submit">Verify Email</button>
        </form>
      )}
      {message && <div style={{ color: "red" }}>{message}</div>}
    </div>
  );
}