import React from "react";
import "../assets/styles/components.css";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const filterNumbers = (string) => {
  return string.replace(/[0-9]/g, "");
};

export const EditProduct = ({
  editTitle,
  editProductData,
  handleEditFormChange,
  handleEditImageChange,
  imageEditPreview,
  handleCancelClick,
  handleEditClick,
  handleSubmitEdit,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const filteredValue = filterNumbers(value);
    handleEditFormChange({
      target: {
        name,
        value: capitalizeFirstLetter(filteredValue),
      },
    });
  };

  return (
    <div className="edit-product">
      <h2>{editTitle}</h2>
      <form onSubmit={handleSubmitEdit}>
        <div className="input-image">
          <div className="input-field">
            <label htmlFor="productImage">Product Image:</label>
            <input
              type="file"
              id="productImage"
              name="productImage"
              onChange={handleEditImageChange}
              accept=".jpg, .jpeg, .png"
            />
          </div>

          <div className="image-preview">
            {imageEditPreview && (
              <img src={imageEditPreview} alt="Product Preview" />
            )}
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="productBrand">Product Brand:</label>
          <input
            type="text"
            id="productBrand"
            name="productBrand"
            value={editProductData.productBrand}
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
              value={editProductData.productName}
              onChange={handleChange}
            />
          </div>

          <div className="input-field">
            <label htmlFor="productFlavor">Product Flavor:</label>
            <input
              type="text"
              id="productFlavor"
              name="productFlavor"
              value={editProductData.productFlavor}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-field">
          <label htmlFor="productAllergen">
            Product Allergen:{" "}
            <span>
              Type <strong>none</strong> if there are no allergen/s
            </span>
          </label>
          <textarea
            id="productAllergen"
            name="productAllergen"
            value={editProductData.productAllergen}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="input-field">
          <label htmlFor="productDescription">Product Description:</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={editProductData.productDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="button-group">
          <button type="button" onClick={handleCancelClick}>
            Cancel
          </button>
          <button type="button" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      </form>
    </div>
  );
};
