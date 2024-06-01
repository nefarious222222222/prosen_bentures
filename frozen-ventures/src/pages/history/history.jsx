import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/history.css";
import { UserContext } from "../../context/user-context";

export const History = () => {
  const { user } = useContext(UserContext);
  const userId = user.accountId;
  const userRole = user.userRole;

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [popupType, setPopupType] = useState("");

  const handleCancelClick = (orderId, productName) => {
    setSelectedOrder(orderId);
    setSelectedProduct(productName);
    setPopupType("cancel");
    setShowPopup(true);
  };

  const handleOrderReceivedClick = (orderId, productName) => {
    setSelectedOrder(orderId);
    setSelectedProduct(productName);
    setPopupType("confirm");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProduct("");
  };

  const handleConfirm = async () => {
    try {
      await updateOrderStatusToComplete(userId, selectedOrder);
      closePopup();
      window.location.reload();
    } catch (error) {
      console.error("Error updating order status to complete:", error);
    }
  };

  return (
    <div className="container history">
      <h1>History</h1>

      <div className="history-container">
        <div className="button-group">
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={filter === "to receive" ? "active" : ""}
            onClick={() => setFilter("to receive")}
          >
            To Receive
          </button>
          <button
            className={filter === "cancel requested" ? "active" : ""}
            onClick={() => setFilter("cancel requested")}
          >
            Cancel Request
          </button>
          <button
            className={filter === "cancelled" ? "active" : ""}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="order-container">
          EWAN
        </div>
      </div>
    </div>
  );
};