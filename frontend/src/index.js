// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline /> {/* buat reset style bawaan browser */}
    <App />
  </React.StrictMode>
);
