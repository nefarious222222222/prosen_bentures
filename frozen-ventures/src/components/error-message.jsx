import React from "react";

export const ErrorMessage = ({ message }) => {
  return (
    <div className="message error">
      <p>{message}</p>
    </div>
  );
};
