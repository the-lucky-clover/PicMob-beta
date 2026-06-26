import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeFeed from "./HomeFeed";

function App() {
  const user = { id: "current-user-id" }; // Replace with real user logic
  const backendUrl = "https://your-worker-url.workers.dev"; // Replace with your backend URL

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeFeed user={user} backendUrl={backendUrl} />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;