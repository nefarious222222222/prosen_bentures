import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/manageSellerOrder.php?shopId=${user.shopId}`
        );
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setErrorMessage("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, [user.shopId]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.status === activeItem ||
      (activeItem === "pending" && order.status === "cancel requested") ||
      (activeItem === "completed" && order.status === "order received") ||
      order.status === "order cancelled"
  );
  return (
    <div className="manage-order">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
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
            className={activeItem === "to-receive" ? "active" : ""}
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
                  <button>Accept Order</button>
                )) ||
                  (order.status === "cancel requested" && (
                    <button>Accept Cancellation</button>
                  ))}
              </div>
              <div className="item-container">
                <div className="product-item">
                  <img
                    src={`http://localhost/api/productImages/${order.productImage}`}
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
                    <p>{capitalizeFirstLetter(order.status)}</p>
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
