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
  const [orders, setOrders] = useState([]);
  const [cancelSelectedId, setCancelSelectedId] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setShowConfirmationPopUp(true);
    setConfirmationTitle("Request Cancel Order");
    setConfirmationMessage("Are you sure you want to cancel this order?");
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

  const filterOrdersByStatus = (statuses) => {
    return orders.filter((order) => statuses.includes(order.status));
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
              orders={filterOrdersByStatus(["order received"])}
            />
          )}
        </div>
      </div>
    </div>
  );
};