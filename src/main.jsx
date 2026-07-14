import React from "react";
import ReactDOM from "react-dom/client";
import PixelEmpire from "./PixelEmpire.jsx";

// Storage adapter: the game was built against the claude.ai artifact storage
// API (window.storage). Outside that environment, back it with localStorage —
// same async shape, saves live on-device.
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value == null ? null : { key, value };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    async list(prefix = "") {
      return { keys: Object.keys(localStorage).filter(k => k.startsWith(prefix)) };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PixelEmpire />
  </React.StrictMode>
);
