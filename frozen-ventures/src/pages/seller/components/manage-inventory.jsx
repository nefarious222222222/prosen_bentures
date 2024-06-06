import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../context/user-context";
import axios from "axios";
import { ProductStock } from "./product-stock";
import { ErrorMessage } from "../../../components/error-message";

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

export const ManageInventory = () => {
  const { user } = useContext(UserContext);
  const shopId = user.shopId;

  const [inventory, setInventory] = useState([]);
  const [showProductStock, setShowProductStock] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const productStockRef = useRef(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/getInventory.php?shopId=${shopId}&status=1`
        );
        setInventory(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, [user.shopId]);

  const handleShowProductStock = (productName, productId) => {
    setSelectedProductName(productName);
    setSelectedProductId(productId);
    setSelectedShopId(user.shopId);
    setShowProductStock(true);
  };

  useEffect(() => {
    const checkLowStock = () => {
      const lowStockProducts = [];
      for (const product of inventory) {
        if (product.totalStock <= 20) {
          lowStockProducts.push(product);
        }
      }
      if (lowStockProducts.length > 0) {
        const productNames = lowStockProducts
          .map((product) => product.productName)
          .join(", ");
        setErrorMessage(`Low stock for: ${productNames}, please check your stocks on all sizes`);
      } else {
        setErrorMessage("");
      }
    };

    checkLowStock();
    setTimeout(() => {
      setErrorMessage("");
    }, 10000);
  }, [inventory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productStockRef.current &&
        !productStockRef.current.contains(event.target)
      ) {
        setShowProductStock(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCancelClick = () => {
    setShowProductStock(false);
  };

  return (
    <div className="manage-inventory">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <h1>Manage Inventory</h1>
      {!inventory || inventory.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <div className="inventory-products-container">
          {inventory.map((product) => (
            <div
              key={product.productID}
              className="inventory-product"
              onClick={() =>
                handleShowProductStock(product.productName, product.productID)
              }
            >
              <div className="inventory-header">
                <p>
                  <span>Product ID: </span>
                  {product.productID}
                </p>
                <p>
                  <span>Date Added: </span>
                  {formatDate(product.dateAdded)}
                </p>
              </div>

              <img
                src={`http://localhost/prosen_bentures/api/productImages/${product.productImage}`}
              />

              <div className="inventory-product-details">
                <p>{product.productName}</p>
                <p>
                  <span>Remaining Stock: </span>
                  {product.totalStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {showProductStock && (
        <div className="inventory-product-stock" ref={productStockRef}>
          <ProductStock
            handleCancelClick={handleCancelClick}
            productName={selectedProductName}
            productId={selectedProductId}
            shopId={selectedShopId}
          />
        </div>
      )}
    </div>
  );
};
