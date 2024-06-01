import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/user-context";
import axios from 'axios';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const ManageOrder = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const userRole = user.userRole;
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Order Request");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post('/path_to_php/fetchOrders.php', { userRole, userId });
      setOrders(response.data);
    };

    fetchData();
  }, [userRole, userId]);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (orders.length > 0) {
        const customerId = orders[0].targetId;
        const response = await axios.post('/path_to_php/fetchCustomerInfo.php', { customerId });
        setCustomerInfo(response.data);
      }
    };

    fetchCustomerInfo();
  }, [orders]);

  const handleFilterClick = (value) => {
    setFilter(value);
  };

  const filteredOrders = orders.filter(({ order }) => {
    if (filter === "Order Request" && order.status === "pending") return true;
    if (filter === "Accepted Order" && order.status === "to receive") return true;
    if (filter === "Cancel Requested" && order.status === "cancel requested") return true;
    if (filter === "Refund Request" && order.status === "refund request") return true;
    if (filter === "Completed" && order.status === "completed") return true;
    if (filter === "Cancelled" && order.status === "cancelled") return true;
    if (filter === "Returned Order" && order.status === "returned") return true;
    return false;
  });

  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setPopupMessage("Are you sure you want to accept this order?");
    setShowPopup(true);
    setErrorMessage(false);
  };

  const handleAcceptRequest = (order) => {
    setSelectedOrder(order);
    setPopupMessage("Are you sure you want to accept this request?");
    setShowPopup(true);
    setErrorMessage(false);
  };

  const handleConfirmAction = async () => {
    if (selectedOrder) {
      const { targetId, orderId } = selectedOrder;
      try {
        if (popupMessage.includes("order")) {
          await axios.post('/path_to_php/updateOrderStatus.php', { userRole, targetId, orderId, status: "to receive" });
        } else if (popupMessage.includes("request")) {
          await axios.post('/path_to_php/updateOrderStatus.php', { userRole, targetId, orderId, status: "cancelled" });
        }
        setShowPopup(false);
        setSelectedOrder(null);
        window.location.reload();
      } catch (error) {
        console.error("Error processing order:", error);
        setShowPopup(false);
        setSelectedOrder(null);
        setErrorMessage(true);

        setTimeout(() => {
          setErrorMessage(false);
        }, 2000);
      }
    }
  };

  const handleCancelAction = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  return (
    <div className="manage-order">
      <h1>Manage Order</h1>
      <div className="order-container">
        <div className="button-group">
          <button className={filter === "Order Request" ? "active" : ""} onClick={() => handleFilterClick("Order Request")}>
            Order Requests
          </button>
          <button className={filter === "Accepted Order" ? "active" : ""} onClick={() => handleFilterClick("Accepted Order")}>
            Accepted Orders
          </button>
          <button className={filter === "Cancel Requested" ? "active" : ""} onClick={() => handleFilterClick("Cancel Requested")}>
            Cancel Requests
          </button>
          <button className={filter === "Refund Request" ? "active" : ""} onClick={() => handleFilterClick("Refund Request")}>
            Refund Requests
          </button>
          <button className={filter === "Returned Order" ? "active" : ""} onClick={() => handleFilterClick("Returned Order")}>
            Returned Orders
          </button>
          <button className={filter === "Completed" ? "active" : ""} onClick={() => handleFilterClick("Completed")}>
            Completed
          </button>
          <button className={filter === "Cancelled" ? "active" : ""} onClick={() => handleFilterClick("Cancelled")}>
            Cancelled
          </button>
        </div>
        {filteredOrders.length > 0 ? (
          <div className="order-item-container">
            {filteredOrders.map(({ targetId, orderId, order }) => (
              <div className="order-item" key={`${targetId}-${orderId}`}>
                <div className="order-info">
                  <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                  <p><span>Status:</span> {capitalizeFirstLetter(order.status)}</p>
                  <p><span>Order Date:</span> {order.orderDate}</p>
                </div>
                {Object.keys(order).map((key) => {
                  const isRetailer = userRole === "retailer";
                  const prefix = isRetailer ? "pid-" : "dpid-";
                  if (key.startsWith(prefix)) {
                    return (
                      <div className="product" key={key}>
                        <div className="product-info">
                          <img src={order[key].productImage} alt={order[key].productName} />
                          <div className="product-description">
                            <p>{order[key].productName}</p>
                            <p>Php {order[key].productPrice}</p>
                            <p>{order[key].shopName}</p>
                          </div>
                        </div>
                        <div className="info">
                          <span>Quantity:</span>
                          <p>x{order.quantity}</p>
                        </div>
                        <div className="info">
                          <span>Total:</span>
                          <p>Php {order.subTotal}</p>
                        </div>
                        <div className="info">
                          <span>Shipping Date:</span>
                          <p>{order.shippingDate}</p>
                        </div>
                        <div className="info">
                          <span>Shipping Mode:</span>
                          <p>{capitalizeFirstLetter(order.shippingMode)}</p>
                        </div>
                        {order.status.toLowerCase() === "cancel requested" && (
                          <div className="info">
                            <span>Cancellation Reason:</span>
                            <p>{order.cancelReason}</p>
                          </div>
                        )}
                        {order.status.toLowerCase() !== "completed" && order.status.toLowerCase() !== "cancelled" && (
                          <>
                            {order.status.toLowerCase() === "cancel requested" ? (
                              <button onClick={() => handleAcceptRequest({ targetId, key, orderId, order })}>
                                Accept Request
                              </button>
                            ) : order.status.toLowerCase() === "refund requested" ? (
                              <button>Process Refund</button>
                            ) : order.shippingMode === "pickup" && order.status.toLowerCase() !== "to receive" ? (
                              <button onClick={() => handleAcceptOrder({ targetId, key, orderId, order })}>
                                Accept Order
                              </button>
                            ) : order.status.toLowerCase() !== "to receive" ? (
                              <button onClick={() => handleAcceptOrder({ targetId, key, orderId, order })}>
                                Ship Order
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-section">
            <h2>Section <span>Empty</span></h2>
            <p>No <span>records</span> found for this <span>section</span></p>
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="error-message">
          <h2>Error</h2>
          <p>Cannot accept this order, product low on stock</p>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Order Confirmation</h2>
            <p>{popupMessage}</p>
            <div className="button-group">
              <button onClick={handleConfirmAction}>Confirm</button>
              <button onClick={handleCancelAction}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
