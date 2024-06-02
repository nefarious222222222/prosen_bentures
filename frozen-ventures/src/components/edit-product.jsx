import React from "react";
import "../assets/styles/components.css";
import { ErrorMessage } from "./error-message";
import { SuccessMessage } from "./success-message";

export const EditProduct = ({
  editTitle,
  errorMessage,
  successMessage,
  editProductData,
  handleEditFormChange,
  handleCancelEditProduct,
  handleSubmitEdit,
}) => {
  return (
    <div className="edit-product">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <h2>{editTitle}</h2>
      <form onSubmit={handleSubmitEdit}>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={editProductData.productName}
              onChange={handleEditFormChange}
              required
            />
          </div>
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productDescription">Product Description:</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={editProductData.productDescription}
              onChange={handleEditFormChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="button-group">
          <button type="button" onClick={handleCancelEditProduct}>
            Cancel
          </button>
          <button type="submit">Edit</button>
        </div>
      </form>
    </div>
  );
};
