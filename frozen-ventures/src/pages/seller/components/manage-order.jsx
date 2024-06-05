import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";

export const ManageOrder = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("pending");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="manage-order">
      <h1>Manage Order</h1>

      <div className="manage-order-container">
        <div className="button-group">
          <button
            className={activeItem === "pending" ? "active" : ""}
            onClick={() => handleItemClick("pending")}
          >
            Pending
          </button>
          <button
            className={activeItem === "completed" ? "active" : ""}
            onClick={() => handleItemClick("completed")}
          >
            Completed
          </button>
        </div>

        <div className="manage-order-container">
          
        </div>
      </div>
    </div>
  );
};
