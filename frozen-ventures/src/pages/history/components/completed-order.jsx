import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { ReviewProduct } from "../../../components/review-product";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentReview, setCurrentReview] = useState({});
  const [reviewData, setReviewData] = useState({
    accountId: "",
    productId: "",
    orderId: "",
    rating: 0,
    feedback: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Add state to manage submission status

  const handleReviewProduct = (order) => {
    setCurrentReview(order);
    setReviewData({
      accountId: user.accountId,
      productId: order.productID,
      orderId: order.orderID,
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
      orderId: "",
      rating: 0,
      feedback: "",
    });
  };

  const handleSaveReview = () => {
    setIsSubmitting(true); // Disable the button during the request
    axios
      .post("http://localhost/prosen_bentures/api/manageReview.php", reviewData)
      .then((response) => {
        if (response.data.status === 1) {
          setSuccessMessage(response.data.message);
          setErrorMessage("");
        } else {
          setErrorMessage(response.data.message);
          setSuccessMessage("");
        }

        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
          handleCancelReview();
        }, 2000);
      })
      .catch((error) => {
        console.error("There was an error saving the review!", error);
        setErrorMessage(
          "There was an error saving the review. Please try again."
        );
        setSuccessMessage("");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      handleSaveReview();
    }
  };

  const handleRate = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const handleFeedbackChange = (e) => {
    setReviewData({ ...reviewData, feedback: e.target.value });
  };

  return (
    <div className="pending-order">
      {successMessage && <SuccessMessage message={successMessage} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {showReviewProduct && (
        <ReviewProduct
          handleCancelReview={handleCancelReview}
          handleSaveReview={handleSaveReview}
          handleRate={handleRate}
          reviewData={reviewData}
          handleSubmitReview={handleSubmitReview}
          handleFeedbackChange={handleFeedbackChange}
          isSubmitting={isSubmitting}
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
                  disabled={isSubmitting}
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