import React from "react";
import "../assets/styles/components.css";

export const EditPrice = ({
  editTitle,
  currentItem,
  handleChange,
  handleEditSave,
  handleEditCancel,
}) => {
  return (
    <div className="edit-price">
      <h2>{editTitle}</h2>

      <form>
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productSizeAmount">Product Size Amount:</label>
            <input
              type="number"
              id="productSizeAmount"
              name="productSizeAmount"
              value={currentItem.productSizeAmount}
              onChange={handleChange}
            />
          </div>
          <div className="input-field">
            <label htmlFor="productSize">Product Size:</label>
            <select
              name="productSize"
              id="productSize"
              value={currentItem.productSize}
              onChange={handleChange}
            >
              <option value="" disabled>Select a size</option>
              <option value="oz">Oz</option>
              <option value="liter">Liter</option>
              <option value="pint">Pint</option>
              <option value="cone">Cone</option>
              <option value="cup">Cup</option>
              <option value="quart">Quart</option>
              <option value="half-gallon">Half Gallon</option>
              <option value="gallon">Gallon</option>
            </select>
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="productPrice">
            Product Price: <span>e.g. 20, 40 or 60</span>
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            value={currentItem.productPrice}
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
            value={currentItem.productStock}
            onChange={handleChange}
          />
        </div>
      </form>

      <div className="button-group">
        <button type="button" onClick={handleEditCancel}>
          Cancel
        </button>
        <button type="button" onClick={handleEditSave}>
          Save
        </button>
      </div>
    </div>
  );
};
