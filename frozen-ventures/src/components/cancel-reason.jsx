import React from "react";
import "../assets/styles/components.css";

export const CancelReason = ({
  selectedReason,
  setSelectedReason,
  reasons,
  handleReasonCancel,
  handleReasonConfirm,
}) => {
  return (
    <div className="cancel-reason">
      <h1>Cancel Order</h1>

      <div className="reason-body">
        <p>Select a reason for cancelling your order:</p>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="" disabled>
            Select a reason
          </option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>
      <div className="button-group">
        <button onClick={handleReasonCancel}>Cancel</button>
        <button onClick={handleReasonConfirm}>Confirm</button>
      </div>
    </div>
  );
};
