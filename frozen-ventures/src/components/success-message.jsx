import React from "react";
import "../assets/styles/components.css";

export const SuccessMessage = ({ message }) => {
  return (
    <div className="message success">
      <p>{message}</p>
    </div>
  );
};
