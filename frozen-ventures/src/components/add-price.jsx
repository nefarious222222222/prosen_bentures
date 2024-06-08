import React from "react";
import "../assets/styles/components.css";

export const AddPrice = ({
  addTitle,
  newProductSizeData,
  handleChange,
  handleAddProductPrice,
  handleAddCancel,
}) => {
  return (
    <div className="add-price">
      <h2>{addTitle}</h2>

      <form>
        <div className="input-field">
          <label htmlFor="productSize">
            Product Size: <span>e.g. 1liter, 2liter or 3liter</span>
          </label>
          <input
            type="text"
            id="productSize"
            name="productSize"
            value={newProductSizeData.productSize}
            onChange={handleChange}
          />
        </div>

        <div className="input-field">
          <label htmlFor="productPrice">
            Product Price: <span>e.g. 20, 40 or 60</span>
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            value={newProductSizeData.productPrice}
            onChange={handleChange}
          />
        </div>

        <div className="input-field">
          <label htmlFor="productStock">
            Product Stock: <span>e.g. 50, 100 or 200</span>
          </label>
          <input
            type="number"
            id="productStock"
            name="productStock"
            value={newProductSizeData.productStock}
            onChange={handleChange}
          />
        </div>
      </form>
      <div className="button-group">
        <button onClick={handleAddCancel}>
          Cancel
        </button>
        <button onClick={handleAddProductPrice}>Add</button>
      </div>
    </div>
  );
};
