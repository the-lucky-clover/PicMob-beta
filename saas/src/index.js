import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./UserContext";
import AppRouter from "./AppRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <AppRouter />
  </UserProvider>
);