import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/history.css";
import { UserContext } from "../../context/user-context";
import { PendingOrder } from "./components/pending-order";
import { ToReceiveOrder } from "./components/toreceive-order";
import { CompleteOrder } from "./components/completed-order";
import { ConfirmationPopUp } from "../../components/confirmation-popup";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";

export const History = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("pending");
  const [cancelSelectedId, setCancelSelectedId] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleCancelRequestClick = (orderId) => {
    setCancelSelectedId(orderId);
    setShowConfirmationPopUp(true);
    setConfirmationTitle("Request Cancel Order");
    setConfirmationMessage("Are you sure you want to cancel this order?");
  };

  const handleConfirmClick = () => {
    if (confirmationTitle == "Request Cancel Order") {
      axios
        .post("http://localhost/api/managePendingOrders.php", {
          accountId: user.accountId,
          orderId: cancelSelectedId,
        })
        .then((response) => {
          if (response.data.status === 1) {
            axios.get(
              `http://localhost/api/managePendingOrders.php?accountId=${user.accountId}`
            );
            setSuccessMessage(response.data.message);
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error occurred while canceling order:", error);
        });

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setShowConfirmationPopUp(false);
      }, 2000);
    } else if (confirmationTitle == "Order Received") {
      // ORDER RECEIVED FUNCTION
    } else {
      setErrorMessage("Something went wrong");
    }
  };

  const handleCancelClick = () => {
    setCancelSelectedId("");
    setShowConfirmationPopUp(false);
    setConfirmationTitle("");
    setConfirmationMessage("");
  };

  return (
    <div className="container history">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle={confirmationTitle}
          confirmMessage={confirmationMessage}
          handleCancel={handleCancelClick}
          handleConfirm={handleConfirmClick}
        />
      )}
      <h1>History</h1>

      <div className="history-container">
        <div className="button-group">
          <button
            className={activeItem === "pending" ? "active" : ""}
            onClick={() => handleItemClick("pending")}
          >
            Pending
          </button>
          <button
            className={activeItem === "to-receive" ? "active" : ""}
            onClick={() => handleItemClick("to-receive")}
          >
            To Receive
          </button>
          <button
            className={activeItem === "completed" ? "active" : ""}
            onClick={() => handleItemClick("completed")}
          >
            Completed
          </button>
        </div>

        <div className="order-container">
          {activeItem === "pending" && (
            <PendingOrder cancelRequest={handleCancelRequestClick} />
          )}
          {activeItem === "to-receive" && <ToReceiveOrder />}
          {activeItem === "completed" && <CompleteOrder />}
        </div>
      </div>
    </div>
  );
};
