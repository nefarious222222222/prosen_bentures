import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { Minus, Plus, Trash } from "phosphor-react";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";

export const CartItems = () => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/manageCart.php?accountId=${user.accountId}`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user.accountId]);

  const handleQuantityChange = (productId, newQuantity, productStock) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.productID === productId
          ? {
              ...cartItem,
              quantity: Math.min(
                Math.max(1, newQuantity),
                cartItem.productStock
              ),
            }
          : cartItem
      )
    );

    axios
      .put(`http://localhost/api/manageCart.php`, {
        accountId: user.accountId,
        productId,
        quantity: newQuantity,
        productStock: productStock,
      })
      .then((response) => {
        if (response.data.status === 1) {
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2000);
  };

  const handleDeleteClick = (productId, productName) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setShowConfirmationPopUp(true);
  };

  const handleCancelClick = () => {
    setSelectedProductId("");
    setSelectedProductName("");
    setShowConfirmationPopUp(false);
  };

  const handleConfirmDeleteClick = () => {
    
  };

  return (
    <div className="cart-item">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      {showConfirmationPopUp && (
        <ConfirmationPopUp
          confirmTitle="Remove From Cart"
          confirmMessage={`Would you like to remove ${selectedProductName} from your cart?`}
          handleConfirm={handleConfirmDeleteClick}
          handleCancel={handleCancelClick}
        />
      )}
      <table>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr key={cartItem.productID}>
              <td className="information">
                <img
                  src={`http://localhost/api/productImages/${cartItem.productImage}`}
                  alt={cartItem.productName}
                />
                <div className="description">
                  <p>{cartItem.productName}</p>
                  <p>{cartItem.productFlavor}</p>
                  <p>{cartItem.shopName}</p>
                  <p>{cartItem.productSize}</p>
                  <p>Php {cartItem.productPrice}</p>
                  <p>Stocks: {cartItem.productStock}</p>
                </div>
              </td>
              <td className="quantity">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.quantity - 1,
                      cartItem.productStock
                    )
                  }
                >
                  <Minus size={25} />
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      cartItem.productID,
                      parseInt(e.target.value),
                      cartItem.productStock
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.quantity + 1,
                      cartItem.productStock
                    )
                  }
                >
                  <Plus size={25} />
                </button>
              </td>
              <td>
                <p>Php {cartItem.totalPrice}</p>
              </td>
              <td className="delete">
                <button
                  onClick={() =>
                    handleDeleteClick(cartItem.productID, cartItem.productName)
                  }
                >
                  <Trash size={45} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
