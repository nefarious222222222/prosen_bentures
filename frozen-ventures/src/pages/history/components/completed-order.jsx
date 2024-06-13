import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/user-context";
import { ReviewProduct } from "../../../components/review-product";

export const CompleteOrder = ({ orders }) => {
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

  const { user } = useContext(UserContext);
  const [showReviewProduct, setShowReviewProduct] = useState(false);
  const [currentReview, setCurrentReview] = useState({});
  const [reviewData, setReviewData] = useState({
    accountId: "",
    productId: "",
    rating: 0,
    feedback: "",
  });

  const handleReviewProduct = (order) => {
    setCurrentReview(order);
    setReviewData({
      accountId: user.accountId,
      productId: order.productID,
      rating: 0,
      feedback: "",
    });
    setShowReviewProduct(true);
  };

  const handleCancelReview = () => {
    setShowReviewProduct(false);
    setReviewData({
      accountId: "",
      productId: "",
      rating: 0,
      feedback: "",
    });
  };

  const handleSaveReview = () => {
    console.log("Review saved:", reviewData);
    handleCancelReview();
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    handleSaveReview();
  };

  const handleRate = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const handleFeedbackChange = (e) => {
    setReviewData({ ...reviewData, feedback: e.target.value });
  };

  return (
    <div className="pending-order">
      {showReviewProduct && (
        <ReviewProduct
          handleCancelReview={handleCancelReview}
          handleSaveReview={handleSaveReview}
          handleRate={handleRate}
          reviewData={reviewData}
          handleSubmitReview={handleSubmitReview}
          handleFeedbackChange={handleFeedbackChange}
        />
      )}
      {orders.length > 0
        ? orders.map((order) => (
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
              </div>
              <div className="item-container">
                <div className="product-item">
                  <img
                    src={`http://localhost/prosen_bentures/api/productImages/${order.productImage}`}
                    alt={order.productName}
                  />
                  <div className="product-details">
                    <p>{order.productName}</p>
                    <p>{order.productBrand}</p>
                    <p>{order.productFlavor}</p>
                    <p>{order.productSize}</p>
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
                        order.status === "order cancelled"
                          ? "order-cancel"
                          : order.status === "order received"
                          ? "status-green"
                          : ""
                      }`}
                    >
                      {capitalizeFirstLetter(order.status)}
                    </p>
                  </div>
                </div>
              </div>

              {order.status === "order received" && (
                <button
                  className="review-btn"
                  onClick={() => handleReviewProduct(order)}
                >
                  Review Product
                </button>
              )}

              {order.status === "order cancelled" && (
                <div className="order-cancelled">
                  <p>Reason For Cancellation:</p>
                  <p>{order.cancelReason}</p>
                </div>
              )}
            </div>
          ))
        : null}
    </div>
  );
};