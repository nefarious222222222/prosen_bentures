import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../../../context/user-context";

export const ManageInventory = () => {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const userRole = user.userRole;

  const [products, setProducts] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProductStock, setOriginalProductStock] = useState({});

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.post("http://localhost/api/fetchSellerProducts.php", {
          userRole,
          userId,
        });
        setProducts(response.data);
        setOriginalProductStock(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, [userRole, userId]);

  const handleAddStockClick = (productId) => {
    setEditingProductId(productId);
  };

  const handleCancelClick = () => {
    setProducts(originalProductStock);
    setEditingProductId(null);
    setShowPopup(false);
  };

  const handleSaveClick = (productId, newStock) => {
    if (products[productId]) {
      setSelectedProduct({ productId, newStock });
      setShowPopup(true);
    }
  };

  const handleConfirmSave = async () => {
    try {
      await axios.post("http://localhost/api/updateProductStock.php", {
        userRole,
        userId,
        productId: selectedProduct.productId,
        newStock: selectedProduct.newStock,
      });
      console.log("Product stock updated successfully.");
    } catch (error) {
      console.error("Error updating product stock:", error);
    } finally {
      setEditingProductId(null);
      setShowPopup(false);
    }
  };

  return (
    <div className="manage-inventory">
      <h1>Manage Inventory</h1>

      <div className="products-container">
        {Object.keys(products).length > 0 ? (
          Object.keys(products).map((productId) => (
            <form key={productId} className="product-item">
              <div className="product-details">
                <p>
                  <span>Product Id:</span> {productId}
                </p>
                <img src={products[productId].productImage} alt="Product" />
              </div>

              <div className="product-details">
                <p>
                  <span>Name:</span> {products[productId].productName}
                </p>
                <p>
                  <span>Price:</span> Php {products[productId].productPrice}
                </p>
                <p>
                  <span>Stock:</span>
                  <input
                    type="number"
                    value={products[productId].productStock}
                    disabled={editingProductId !== productId}
                    className={
                      editingProductId !== productId ? "no-border" : ""
                    }
                    onChange={(e) => {
                      const newStock = e.target.value;
                      setProducts((prevProducts) => ({
                        ...prevProducts,
                        [productId]: {
                          ...prevProducts[productId],
                          productStock: newStock,
                        },
                      }));
                    }}
                  />
                </p>
              </div>

              <div className="button-group">
                {editingProductId !== productId ? (
                  <button
                    type="button"
                    onClick={() => handleAddStockClick(productId)}
                  >
                    Add Stock
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveClick(productId, products[productId].productStock)
                      }
                    >
                      Save
                    </button>
                    <button type="button" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <h2>Confirmation</h2>
          <p>Are you sure you want to save changes?</p>
          <div className="button-group">
            <button onClick={handleConfirmSave}>Confirm</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
