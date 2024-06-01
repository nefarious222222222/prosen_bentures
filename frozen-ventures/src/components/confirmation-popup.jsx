import React from "react";
import "../assets/styles/components.css"

export const ConfirmationPopUp = ({ confirmTitle, confirmMessage, handleCancel, handleConfirm }) => {
  return (
    <div className="confirmation-popup">
      <h1>{confirmTitle}</h1>
      <p>{confirmMessage}</p>
      <div className="button-group">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};