import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Register from "./Register";
import Login from "./Login";
import RequestReset from "./RequestReset";
import ResetPassword from "./ResetPassword";
import HomeFeed from "./HomeFeed";
import Profile from "./Profile";
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
        <Route
          path="/profile"
          element={
            userId ? (
              <Profile backendUrl={backendUrl} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}