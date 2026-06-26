import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

export default function Profile({ backendUrl }) {
  const { userId, setUserId } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    setUserId(null);
    navigate("/login");
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {userId}</p>
      {/* Add more profile info here as needed */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}