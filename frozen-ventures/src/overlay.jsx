import React, { useEffect } from "react";
import "./assets/styles/App.css";

const Overlay = ({ show }) => {
  useEffect(() => {
    if (show) {
      const overlay = document.createElement("div");
      overlay.className = "dark-overlay";
      overlay.id = "dark-overlay";
      document.body.appendChild(overlay);
    } else {
      const overlay = document.getElementById("dark-overlay");
      if (overlay) {
        document.body.removeChild(overlay);
      }
    }

    return () => {
      const overlay = document.getElementById("dark-overlay");
      if (overlay) {
        document.body.removeChild(overlay);
      }
    };
  }, [show]);

  return null;
};

export default Overlay;
