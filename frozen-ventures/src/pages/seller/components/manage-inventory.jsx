import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../../context/user-context";
import axios from "axios";
import { ProductStock } from "./product-stock";

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
    const intervalId = setInterval(fetchInventory, 5000);
    return () => clearInterval(intervalId);
  }, [user.shopId]);

  const handleShowProductStock = (productName, productId) => {
    setSelectedProductName(productName);
    setSelectedProductId(productId);
    setSelectedShopId(user.shopId);
    setShowProductStock(true);
  };

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
