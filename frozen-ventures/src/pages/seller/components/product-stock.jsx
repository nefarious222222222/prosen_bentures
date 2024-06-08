import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import { EditPrice } from "../../../components/edit-price";
import { AddPrice } from "../../../components/add-price";

export const ProductStock = ({
  handleCancelClick,
  productName,
  productId,
  shopId,
}) => {
  const [inventory, setInventory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newProductSizeData, setNewProductSizeData] = useState({
    productSize: "",
    productPrice: "",
    productStock: "",
  });
  const [currentItem, setCurrentItem] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    const fetchInventory = () => {
      axios
        .get(
          `http://localhost/prosen_bentures/api/manageInventory.php?productId=${productId}`
        )
        .then((response) => {
          setInventory(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchInventory();

    const intervalId = setInterval(fetchInventory, 3000);

    return () => clearInterval(intervalId);
  }, [productId, shopId]);

  const handleConfirm = () => {
    if (confirmTitle === "Add Size") {
      const sizeData = {
        productSize: newProductSizeData.productSize,
        productPrice: newProductSizeData.productPrice,
        productStock: newProductSizeData.productStock,
        shopId: shopId,
        productId: productId,
      };
      axios
        .post(
          "http://localhost/prosen_bentures/api/manageInventory.php",
          sizeData
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
            axios
              .get(
                `http://localhost/prosen_bentures/api/manageInventory.php?productId=${productId}`
              )
              .then((response) => {
                setInventory(Array.isArray(response.data) ? response.data : []);
              });
          } else {
            setErrorMessage(response.data.message);
          }
          setShowAddForm(false);
          setNewProductSizeData([]);
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage(
            "An error occurred while adding size, price, and stock"
          );
        });
    } else if (confirmTitle === "Edit Title" && currentItem) {
      axios
        .put(
          `http://localhost/prosen_bentures/api/manageInventory.php`,
          currentItem
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
            axios
              .get(
                `http://localhost/prosen_bentures/api/manageInventory.php?productId=${productId}`
              )
              .then((response) => {
                setInventory(Array.isArray(response.data) ? response.data : []);
              });
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage(
            "An error occurred while editing size, price, and stock"
          );
        });
      setShowEditForm(false);
    } else if (confirmTitle === "Remove Size" && currentItem) {
      axios
        .delete(`http://localhost/prosen_bentures/api/manageInventory.php`, {
          data: { priceID: currentItem.priceID },
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.status === 1) {
            setSuccessMessage(response.data.message);
            axios
              .get(
                `http://localhost/prosen_bentures/api/manageInventory.php?productId=${productId}`
              )
              .then((response) => {
                setInventory(Array.isArray(response.data) ? response.data : []);
              });
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage(
            "An error occurred while removing size, price, and stock"
          );
        });
    }

    setShowConfirmationPopUp(false);
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 2500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (showEditForm) {
      setCurrentItem({
        ...currentItem,
        [name]: value,
      });
    } else {
      setNewProductSizeData({
        ...newProductSizeData,
        [name]: value,
      });
    }
  };

  const handleAddSize = () => {
    setShowAddForm(true);
    setConfirmTitle("Add Size");
    setConfirmMessage("Would like to add this price?");
  };

  const handleEditProductSize = (priceId) => {
    setCurrentItem(inventory.find((item) => item.priceID === priceId));
    setShowEditForm(true);
    setConfirmTitle("Edit Title");
    setConfirmMessage("Would you like to save your update on this price?");
  };

  const handleRemoveClick = (item) => {
    setCurrentItem(item);
    setConfirmTitle("Remove Size");
    setConfirmMessage("Are you sure you want to remove this size?");
    setShowConfirmationPopUp(true);
  };

  const handleEditSave = () => {
    setShowConfirmationPopUp(true);
  };

  const handleAddProductPrice = () => {
    setShowConfirmationPopUp(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowConfirmationPopUp(false);
    setConfirmTitle("");
    setConfirmMessage("");
  };

  return (
    <>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showEditForm && (
        <EditPrice
          editTitle="Edit Price"
          currentItem={currentItem}
          handleChange={handleInputChange}
          handleEditSave={handleEditSave}
          handleEditCancel={handleCancel}
        />
      )}
      {showAddForm && (
        <AddPrice
          addTitle="Add Price"
          newProductSizeData={newProductSizeData}
          handleChange={handleInputChange}
          handleAddProductPrice={handleAddProductPrice}
          handleAddCancel={handleCancel}
        />
      )}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle={confirmTitle}
          confirmMessage={confirmMessage}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
        />
      )}
      <div className="stock-container">
        <div className="header">
          <button onClick={handleCancelClick}>Cancel</button>
          <h2>{productName}</h2>
          <button onClick={handleAddSize}>Add</button>
        </div>
        <div className="inventory-list">
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="4">No records yet</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.priceID} className="inventory-item">
                    <td>{item.productSize}</td>
                    <td>Php {item.productPrice}</td>
                    <td>x {item.productStock}</td>
                    <td>
                      <div className="button-group">
                        <button onClick={() => handleRemoveClick(item)}>
                          Remove
                        </button>{" "}
                        <button
                          onClick={() => {
                            handleEditProductSize(item.priceID);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
