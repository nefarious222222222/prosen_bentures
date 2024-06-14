import React, { useState } from "react";
import "../assets/styles/review-product.css";
import { Star } from "phosphor-react";

export const ReviewProduct = ({
  handleCancelReview,
  handleSaveReview,
  handleRate,
  reviewData,
  handleSubmitReview,
  handleFeedbackChange,
  isSubmitting, // Added isSubmitting prop
}) => {
  const [hoverIndex, setHoverIndex] = useState(-1);

  return (
    <div className="review-product">
      <h1>Review Product</h1>

      <form onSubmit={handleSubmitReview}>
        <div className="rate-container">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={40}
              weight="fill"
              className={
                index <= (hoverIndex >= 0 ? hoverIndex : reviewData.rating - 1)
                  ? "filled"
                  : ""
              }
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              onClick={() => handleRate(index + 1)}
            />
          ))}
        </div>

        <div className="input-field">
          <label htmlFor="feedback">Feedback: </label>
          <textarea
            name="feedback"
            id="feedback"
            value={reviewData.feedback}
            onChange={handleFeedbackChange}
          ></textarea>
        </div>

        <div className="button-container">
          <button type="button" onClick={handleCancelReview}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Review"}
          </button>
        </div>
      </form>
    </div>
  );
};
