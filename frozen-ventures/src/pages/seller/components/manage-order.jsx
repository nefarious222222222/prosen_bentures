import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (dateString) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const parts = dateString.split("-");
  const year = parts[0];
  const month = months[parseInt(parts[1], 10) - 1];
  const day = parts[2];

  return `${month} ${parseInt(day, 10)}, ${year}`;
};

export const ManageOrder = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedPriceId, setSelectedPriceId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost/prosen_bentures/api/manageSellerOrder.php?shopId=${user.shopId}`
      );
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Failed to fetch orders. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user.shopId]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleAcceptOrderClick = (orderId, priceId, productQuantity) => {
    setSelectedOrderId(orderId);
    setSelectedPriceId(priceId);
    setProductQuantity(productQuantity);
    setConfirmationTitle("Confirm Order");
    setConfirmationMessage("Are you sure you want to accept this order?");
    setShowConfirmationPopUp(true);
  };

  const handleAcceptRequestClick = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmationTitle("Order Cancellation");
    setConfirmationMessage(
      "Are you sure you want to accept this cancel request?"
    );
    setShowConfirmationPopUp(true);
  };

  const handleCancelConfirmationClick = () => {
    setSelectedOrderId("");
    setConfirmationTitle("");
    setConfirmationMessage("");
    setShowConfirmationPopUp(false);
  };

  const handleConfirmConfirmationClick = () => {
    if (selectedOrderId && confirmationTitle === "Confirm Order") {
      const updatePriceData = {
        priceId: selectedPriceId,
        productQuantity: productQuantity,
      };
      axios
        .put(
          "http://localhost/prosen_bentures/api/manageSellerOrder.php",
          updatePriceData
        )
        .then((response) => {
          if (response.data.status === 1) {
            const updateOrderData = {
              orderId: selectedOrderId,
              status: "to receive",
            };
            axios
              .post(
                "http://localhost/prosen_bentures/api/manageSellerOrder.php",
                updateOrderData
              )
              .then((response) => {
                setSuccessMessage(response.data.message);
                fetchOrders();
              })
              .catch((error) => {
                console.error("Error updating order status:", error);
                setErrorMessage(
                  "Failed to update order status. Please try again."
                );
              });
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating product stock:", error);
          setErrorMessage("Failed to update product stock. Please try again.");
        });
    } else if (selectedOrderId && confirmationTitle === "Order Cancellation") {
      const updateOrderData = {
        orderId: selectedOrderId,
        status: "order cancelled",
      };
      axios
        .post(
          "http://localhost/prosen_bentures/api/manageSellerOrder.php",
          updateOrderData
        )
        .then((response) => {
          setSuccessMessage(response.data.message);
          fetchOrders();
        })
        .catch((error) => {
          console.error("Error updating order status:", error);
          setErrorMessage("Failed to update order status. Please try again.");
        });
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }

    setTimeout(() => {
      setSelectedOrderId("");
      setConfirmationTitle("");
      setConfirmationMessage("");
      setSuccessMessage("");
      setShowConfirmationPopUp(false);
    }, 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeItem === "pending") {
      return order.status === "pending" || order.status === "cancel requested";
    } else if (activeItem === "to receive") {
      return order.status === "to receive";
    } else if (activeItem === "completed") {
      return (
        order.status === "order received" || order.status === "order cancelled"
      );
    }
    return false;
  });

  return (
    <div className="manage-order">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle={confirmationTitle}
          confirmMessage={confirmationMessage}
          handleCancel={handleCancelConfirmationClick}
          handleConfirm={handleConfirmConfirmationClick}
        />
      )}
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
            className={activeItem === "to receive" ? "active" : ""}
            onClick={() => handleItemClick("to receive")}
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
          {filteredOrders.map((order) => (
            <div key={order.orderID} className="order-item">
              <div className="item-header">
                <p>
                  <span>Order Date: </span>
                  {formatDate(order.orderDate)}
                </p>

                <p>
                  <span>Receive Date: </span>
                  {formatDate(order.receiveDate)}
                </p>

                {(order.status === "pending" && (
                  <button
                    onClick={() => {
                      handleAcceptOrderClick(
                        order.orderID,
                        order.priceID,
                        order.quantity
                      );
                    }}
                  >
                    Accept Order
                  </button>
                )) ||
                  (order.status === "cancel requested" && (
                    <button
                      onClick={() => {
                        handleAcceptRequestClick(order.orderID);
                      }}
                    >
                      Accept Request
                    </button>
                  ))}
              </div>

              <div className="customer-info">
                <p>
                  <span>Name: </span>
                  {order.firstName} {order.lastName}
                </p>
                <p>
                  <span>Address: </span>
                  {order.street} {order.barangay} {order.municipality}{" "}
                  {order.province} {order.zip}
                </p>
              </div>

              <div className="item-container">
                <div className="product-item">
                  <img
                    src={`http://localhost/prosen_bentures/api/productImages/${order.productImage}`}
                    alt={order.productName}
                  />
                  <div className="product-details">
                    <p>{order.productName}</p>
                    <p>{order.productFlavor}</p>
                  </div>
                </div>
                <div className="order-details">
                  <div className="detail">
                    <p className="label">Quantity:</p>
                    <p>x{order.quantity}</p>
                  </div>
                  <div className="detail">
                    <p className="label">Total Price:</p>
                    <p>Php {order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="detail">
                    <p className="label">Shipping Mode:</p>
                    <p>{capitalizeFirstLetter(order.shippingMode)}</p>
                  </div>
                  <div className="detail">
                    <p className="label">Status:</p>
                    <p
                      className={`${
                        order.status === "cancel requested"
                          ? "cancel-requested"
                          : order.status === "order cancelled"
                          ? "order-cancelled"
                          : order.status === "pending" ||
                            order.status === "to receive" ||
                            order.status === "order received"
                          ? "status-green"
                          : ""
                      }`}
                    >
                      {capitalizeFirstLetter(order.status)}
                    </p>
                  </div>
                </div>
              </div>

              {order.status == "order cancelled" ||
                (order.status == "cancel requested" && (
                  <div className="order-cancelled">
                    <p>Reason For Cancellation:</p>
                    <p>{order.cancelReason}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
