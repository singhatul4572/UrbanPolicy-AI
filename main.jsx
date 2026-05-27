// ============================================================
//  src/main.jsx — React Entry Point
//
//  This is the root file that mounts the React app into the
//  HTML page (index.html → <div id="root">).
//  Keep this file minimal — all logic lives in App.jsx.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Mount the app — no CSS imports needed (styles are inline in App.jsx)
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
