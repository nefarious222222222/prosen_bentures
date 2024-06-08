import React from "react";
import "../assets/styles/components.css";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const filterNumbers = (string) => {
  return string.replace(/[0-9]/g, '');
};

export const AddProduct = ({
  newProductData,
  showAddProductPopup,
  handleSubmit,
  handleImageChange,
  imagePreview,
  handleProductFormChange,
  handleCancelAddProductClick,
  handleAddProductClick,
}) => {

  const handleChange = (event) => {
    const { name, value } = event.target;
    const filteredValue = filterNumbers(value);
    handleProductFormChange({
      target: {
        name,
        value: capitalizeFirstLetter(filteredValue),
      },
    });
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleImageChange}
            accept=".jpg, .jpeg, .png"
            required={showAddProductPopup}
          />
        </div>

        <div className="image-preview">
          {newProductData.productImage && (
            <img src={imagePreview} alt="Product" />
          )}
        </div>

        <div className="input-field">
          <label htmlFor="productBrand">Product Brand:</label>
          <input
            type="text"
            id="productBrand"
            name="productBrand"
            value={newProductData.productBrand}
            onChange={handleChange}
          />
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={newProductData.productName}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label htmlFor="productFlavor">Product Flavor:</label>
            <input
              type="text"
              id="productFlavor"
              name="productFlavor"
              value={newProductData.productFlavor}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="input-field">
            <label htmlFor="productDescription">Product Description:</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={newProductData.productDescription}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </form>
      <div className="button-group">
        <button type="button" onClick={handleCancelAddProductClick}>Cancel</button>
        <button type="button" onClick={handleAddProductClick}>Add</button>
      </div>
    </div>
  );
};