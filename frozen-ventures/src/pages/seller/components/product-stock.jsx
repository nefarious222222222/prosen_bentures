import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";

export const ProductStock = ({ productName, productId, accountId }) => {
  const [inventory, setInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

  useEffect(() => {
    const fetchInventory = () => {
      axios
        .get(
          `http://localhost/api/manageInventory.php?productId=${productId}&accountId=${accountId}`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 0) {
            setErrorMessage(
              "Failed to update product: " + response.data.message
            );
          } else {
            setInventory(Array.isArray(response.data) ? response.data : []);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("An error occurred while updating the product");
        });
    };
    fetchInventory();
    const intervalId = setInterval(fetchInventory, 3000);
    return () => clearInterval(intervalId);
  }, [productId, accountId]);

  const handleAddSize = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newPrice || !newSize || !newStock) {
      setErrorMessage("Cannot be empty");
    } else {
      const sizeData = {
        newSize: newSize,
        newPrice: newPrice,
        newStock: newStock,
        accountId: accountId,
        productId: productId,
      };
      axios
        .post("http://localhost/api/manageInventory.php", sizeData)
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("An error occurred while adding size");
        });

      setShowAddForm(false);
      setNewSize("");
      setNewPrice("");
      setNewStock("");
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  const handleRemoveClick = () => {
    setShowConfirmationPopUp(true);
  };

  return (
    <div className="stock-container">
      <div className="header">
        <h2>{productName}</h2>
        <button onClick={handleAddSize}>Add Size</button>
      </div>
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      {successMessage ? <SuccessMessage message={successMessage} /> : null}
      {showConfirmationPopUp ? (
        <ConfirmationPopUp
          confirmTitle="Remove Size"
          confirmMessage="Would you like to remove this size?"
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      ) : null}

      {inventory.length === 0 ? (
        <p>putangina</p>
      ) : (
        <div className="inventory-list">
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {showAddForm && (
                <tr className="add-size">
                  <td>
                    <input
                      type="text"
                      placeholder="Example: 1 liter"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </td>
                </tr>
              )}
              {inventory.map((item) => (
                <tr key={item.priceID} className="inventory-item">
                  <td>{item.productSize}</td>
                  <td>Php {item.productPrice}</td>
                  <td>x {item.productStock}</td>
                  <td>
                    <button>Edit</button>
                    <button onClick={handleRemoveClick}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
