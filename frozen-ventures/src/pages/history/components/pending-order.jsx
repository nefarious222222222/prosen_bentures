import React from "react";

export const PendingOrder = ({ orders, cancelRequest }) => {
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

  return (
    <div className="pending-order">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderID} className="order-item">
            <div className="item-header">
              <p>
                <span>Shop Name: </span>
                {order.shopName}
              </p>

              <p>
                <span>Order Date: </span>
                {formatDate(order.orderDate)}
              </p>

              <p>
                <span>Receive Date: </span>
                {formatDate(order.receiveDate)}
              </p>

              {order.status === "pending" && (
                <button onClick={() => cancelRequest(order.orderID)}>
                  Request Cancel Order
                </button>
              )}
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
                  <p>{capitalizeFirstLetter(order.status)}</p>
                </div>
              </div>
            </div>

            {order.status == "cancel requested" && (
              <div className="order-cancelled">
                <p>Reason For Cancellation:</p>
                <p>{order.cancelReason}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="empty-pending">
          <h1>Empty</h1>
          <p>No pending or cancel requested orders</p>
        </div>
      )}
    </div>
  );
};
