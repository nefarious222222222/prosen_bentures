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
import { CancelReason } from "../../components/cancel-reason";

export const History = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [cancelSelectedId, setCancelSelectedId] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost/api/managePendingOrders.php?accountId=${user.accountId}`
      );
      if (response.data.status === 0) {
        setErrorMessage(response.data.message);
      } else {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user.accountId]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    fetchOrders();
  };

  const handleCancelRequestClick = (orderId) => {
    setCancelSelectedId(orderId);
    setShowCancelReason(true);
  };

  const handleReceiveOrderClick = (orderId) => {
    setCancelSelectedId(orderId);
    setShowConfirmationPopUp(true);
    setConfirmationTitle("Receive Order");
    setConfirmationMessage("Are you sure you have received this order?");
  };

  const handleConfirmClick = () => {
    if (confirmationTitle === "Request Cancel Order") {
      axios
        .post("http://localhost/api/managePendingOrders.php", {
          accountId: user.accountId,
          orderId: cancelSelectedId,
          status: "cancel requested",
          cancelReason: selectedReason,
        })
        .then((response) => {
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.orderID !== cancelSelectedId)
            );
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error occurred while canceling order:", error);
          setErrorMessage("Error occurred while canceling order");
        });

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setShowConfirmationPopUp(false);
      }, 2000);
    } else if (confirmationTitle === "Receive Order") {
      axios
        .post("http://localhost/api/managePendingOrders.php", {
          accountId: user.accountId,
          orderId: cancelSelectedId,
          status: "order received",
          cancelReason: "N/A",
        })
        .then((response) => {
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.orderID !== cancelSelectedId)
            );
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error occurred while canceling order:", error);
          setErrorMessage("Error occurred while canceling order");
        });

      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
        setShowConfirmationPopUp(false);
      }, 2000);
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

  const handleReasonCancel = () => {
    setShowCancelReason(false);
    setSelectedReason("");
    setErrorMessage("");
  };

  const handleReasonConfirm = () => {
    if (!selectedReason) {
      setErrorMessage("Please select a reason for cancellation.");
      return;
    }
    setShowConfirmationPopUp(true);
    setConfirmationTitle("Request Cancel Order");
    setConfirmationMessage("Are you sure you want to cancel this order?");
    setShowCancelReason(false);
  };

  const filterOrdersByStatus = (statuses) => {
    return orders.filter((order) => statuses.includes(order.status));
  };

  const reasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Item not needed anymore",
    "Ordered by mistake",
    "Wrong item ordered",
    "No longer needed due to a change in plans",
    "Other...",
  ];

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
      {showCancelReason && (
        <CancelReason
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
          reasons={reasons}
          handleReasonCancel={handleReasonCancel}
          handleReasonConfirm={handleReasonConfirm}
        />
      )}
      <h1>Purchase History</h1>

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
            <PendingOrder
              orders={filterOrdersByStatus(["pending", "cancel requested"])}
              cancelRequest={handleCancelRequestClick}
            />
          )}
          {activeItem === "to-receive" && (
            <ToReceiveOrder
              orders={filterOrdersByStatus(["to receive"])}
              receiveOrder={handleReceiveOrderClick}
            />
          )}
          {activeItem === "completed" && (
            <CompleteOrder
              orders={filterOrdersByStatus([
                "order received",
                "order cancelled",
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};
