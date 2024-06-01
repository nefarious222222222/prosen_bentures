import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../../../context/user-context";
import {
  fetchSellerProducts,
  addProduct,
  editProduct,
} from "../../../../firebase/firebase-reseller";

export const ManageProducts = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const userRole = user.userRole;
  const shopName = user.shopName;

  const [products, setProducts] = useState({});
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showEditProductPopup, setShowEditProductPopup] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProductData, setNewProductData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: null,
    productStock: "0",
    productSize: "",
    shopName: shopName,
  });

  const [imageError, setImageError] = useState("");
  const popupRef = useRef(null);

  useEffect(() => {
    const getProducts = async () => {
      const fetchedProducts = await fetchSellerProducts(userRole, userId);
      setProducts(fetchedProducts);
    };

    getProducts();
  }, [userRole, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAddProductPopup(false);
        setShowEditProductPopup(false);
      }
    };

    if (showAddProductPopup || showEditProductPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddProductPopup, showEditProductPopup]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleAddProduct = () => {
    setShowAddProductPopup(true);
  };

  const handleEditProduct = (productId) => {
    setCurrentProductId(productId);
    const productData = products[productId];
    setNewProductData(productData);
    setShowEditProductPopup(true);
  };

  const handleRemoveProduct = (productId) => {
    setCurrentProductId(productId);
    const productData = products[productId];
    console.log("remove item");
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setNewProductData({ ...newProductData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (file && validImageTypes.includes(file.type)) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width === img.height) {
            setNewProductData({
              ...newProductData,
              productImage: reader.result,
            });
            setImageError("");
          } else {
            setImageError("Image aspect ratio must be 1:1.");
          }
        };
        img.src = reader.result;
      };

      reader.readAsDataURL(file);
    } else {
      setImageError("Only .jpg, .jpeg, and .png formats are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageError) {
      return;
    }

    try {
      const productData = {
        ...newProductData,
        productImage:
          newProductData.productImage ||
          products[currentProductId].productImage,
      };

      if (showAddProductPopup) {
        productData.dateAdded = Date.now();
        await addProduct(userRole, userId, productData);
        setShowAddProductPopup(false);
      } else if (showEditProductPopup) {
        await editProduct(userRole, userId, currentProductId, productData);
        setShowEditProductPopup(false);
      }

      setNewProductData({
        productName: "",
        productPrice: "",
        productDescription: "",
        productImage: null,
        productStock: "0",
        productSize: "",
        shopName: shopName,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  return (
    <div className="manage-products">
      <div className="header">
        <h1>Manage Products</h1>
        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="products-container">
        {Object.keys(products).length > 0 ? (
          Object.keys(products).map((productId) => (
            <div key={productId} className="product-item">
              <div className="product-info">
                <p>
                  <span>Product Id:</span> {productId}
                </p>
                <p>
                  <span>Date Added:</span>{" "}
                  {formatDate(products[productId].dateAdded)}
                </p>
              </div>

              <div className="product">
                <img src={products[productId].productImage} alt="Product" />

                <div className="product-text">
                  <div className="info">
                    <p>
                      <span>Product Name: </span>
                      {products[productId].productName}
                    </p>
                    <p>
                      <span>Product Price: </span>Php{" "}
                      {products[productId].productPrice}
                    </p>
                    <p>
                      <span>Product Size: </span>
                      {products[productId].productSize}
                    </p>
                    <p>
                      <span>Stock:</span> {products[productId].productStock}
                    </p>
                  </div>
                  <p className="description">
                    {products[productId].productDescription}
                  </p>
                </div>

                <div className="group-button">
                  <button onClick={() => handleEditProduct(productId)}>
                    Edit
                  </button>
                  <button onClick={() => handleRemoveProduct(productId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {(showAddProductPopup || showEditProductPopup) && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
            <h2>{showAddProductPopup ? "Add Product" : "Edit Product"}</h2>

            {imageError && <p className="error">{imageError}</p>}
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
                  <img src={newProductData.productImage} alt="Product" />
                )}
              </div>

              <div className="input-container">
                <div className="input-field">
                  <label htmlFor="productName">Product Name:</label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={newProductData.productName}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="productPrice">Product Price:</label>
                  <input
                    type="number"
                    id="productPrice"
                    name="productPrice"
                    value={newProductData.productPrice}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
              </div>

              <div className="input-container">
                {showAddProductPopup && (
                  <div className="input-field">
                    <label htmlFor="productStock">Product Stock:</label>
                    <input
                      type="number"
                      id="productStock"
                      name="productStock"
                      value={newProductData.productStock}
                      onChange={handleProductFormChange}
                      required
                    />
                  </div>
                )}
                <div className="input-field">
                  <label htmlFor="productSize">Product Size:</label>
                  <select
                    id="productSize"
                    name="productSize"
                    value={newProductData.productSize}
                    onChange={handleProductFormChange}
                    required
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    <option value="Jr. Cup">Jr. Cup</option>
                    <option value="1 Pint">1 Pint</option>
                    <option value="1.7 Liters">1.7 Liters</option>
                    <option value="1 Gallon">1 Gallon</option>
                  </select>
                </div>
              </div>

              <div className="input-field">
                <label htmlFor="productDescription">Product Description:</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={newProductData.productDescription}
                  onChange={handleProductFormChange}
                  required
                ></textarea>
              </div>

              <div className="button-group">
                <button type="submit">
                  {showAddProductPopup ? "Add" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductPopup(false);
                    setShowEditProductPopup(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
