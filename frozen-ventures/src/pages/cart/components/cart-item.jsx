import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../../context/user-context";
import { Minus, Plus, Trash } from "phosphor-react";
import { AnimatePresence, easeInOut, motion as m } from "framer-motion";
import {
  fetchCartItemsForUser,
  removeItemFromCart,
  setCartItemQuantity,
  fetchProductStockByProductId,
  fetchProductSizeByProductId,
} from "../../../firebase/firebase-products";

export const CartItem = ({ setTotalPrice, setProducts }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const confirmDeleteRef = useRef(null);

  const userId = user.userId;
  const userRole = user.userRole;

  useEffect(() => {
    const fetchCartItems = () => {
      if (userId) {
        try {
          fetchCartItemsForUser(userRole, userId, async (cartItemsData) => {
            if (typeof cartItemsData === "object") {
              const cartItemsArray = await Promise.all(
                Object.keys(cartItemsData).map(async (key) => {
                  const productStock = await fetchProductStockByProductId(userRole, key);
                  const productSize = await fetchProductSizeByProductId(userRole, key);
                  return {
                    productId: key,
                    productStock: productStock,
                    productSize: productSize,
                    ...cartItemsData[key],
                  };
                })
              );
              setCartItems(cartItemsArray);
            } else {
              console.error("Cart items data is not an object:", cartItemsData);
            }
          });
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };
    fetchCartItems();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId]);

  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.productPrice,
      0
    );
    setProducts(cartItems);
    setTotalPrice(total);
  }, [cartItems, setTotalPrice, setProducts]);

  const handleDelete = (productId) => {
    setItemToDelete(productId);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeItemFromCart(userRole, userId, itemToDelete);
      setCartItems(cartItems.filter((item) => item.productId !== itemToDelete));
    }
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
    setShowConfirmDelete(false);
  };

  const handleClickOutside = (event) => {
    if (
      confirmDeleteRef.current &&
      !confirmDeleteRef.current.contains(event.target)
    ) {
      setShowConfirmDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updateCartItemQuantity = async (productId, newQuantity) => {
    const selectedItem = cartItems.find((item) => item.productId === productId);
    if (!selectedItem) {
      console.error("Selected item not found in cart.");
      return;
    }
  
    const productStock = await fetchProductStockByProductId(userRole, productId);
    if (!productStock) {
      console.error("Product stock not found for productId:", productId);
      return;
    }
  
    if (newQuantity < 1 || isNaN(newQuantity)) {
      newQuantity = 1;
    } else if (newQuantity > productStock) {
      newQuantity = productStock;
    }
  
    const updatedCartItems = cartItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  
    setCartItems(updatedCartItems);
  
    await setCartItemQuantity(
      userRole,
      userId,
      productId,
      newQuantity,
      selectedItem.productPrice,
      selectedItem.productName,
      selectedItem.shopName,
      selectedItem.productImage,
      productStock
    );
  };

  const handleIncrement = async (productId) => {
    const productStock = await fetchProductStockByProductId(userRole, productId);
    if (!productStock) {
      console.error("Product stock not found for productId:", productId);
      return;
    }

    const selectedItem = cartItems.find((item) => item.productId === productId);
    const updatedQuantity = selectedItem.quantity + 1;
    if (updatedQuantity <= productStock) {
      await updateCartItemQuantity(productId, updatedQuantity);
    }
  };

  const handleDecrement = async (productId) => {
    const selectedItem = cartItems.find((item) => item.productId === productId);
    if (selectedItem.quantity > 1) {
      const updatedQuantity = selectedItem.quantity - 1;
      await updateCartItemQuantity(productId, updatedQuantity);
    }
  };

  const handleQuantityChange = (event, productId) => {
    let updatedQuantity = parseInt(event.target.value, 10);
    if (updatedQuantity < 1 || isNaN(updatedQuantity)) {
      updatedQuantity = 1;
    }

    const selectedItem = cartItems.find((item) => item.productId === productId);
    if (updatedQuantity > selectedItem.productStock) {
      updatedQuantity = selectedItem.productStock;
    }

    const updatedCartItems = cartItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleQuantityBlur = async (productId) => {
    const selectedItem = cartItems.find((item) => item.productId === productId);
    if (selectedItem) {
      await updateCartItemQuantity(productId, selectedItem.quantity);
    }
  };

  return (
    <div className="cart-item">
      <table>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr key={cartItem.productId}>
              <td className="information">
                <img src={cartItem.productImage} alt={cartItem.productName} />
                <div className="description">
                  <p>{cartItem.productName}</p>
                  <p>{cartItem.shopName}</p>
                  <p>{cartItem.productSize}</p>
                  <p>Php {cartItem.productPrice}</p>
                  <p>Stocks: {cartItem.productStock}</p>
                </div>
              </td>
              <td className="quantity">
                <button
                  onClick={() => handleDecrement(cartItem.productId)}
                  disabled={cartItem.quantity <= 1}
                >
                  <Minus size={25} />
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  onChange={(e) => handleQuantityChange(e, cartItem.productId)}
                  onBlur={() => handleQuantityBlur(cartItem.productId)}
                />
                <button
                  onClick={() => handleIncrement(cartItem.productId)}
                  disabled={cartItem.quantity >= cartItem.productStock}
                >
                  <Plus size={25} />
                </button>
              </td>
              <td>
                <p>
                  Php {(cartItem.quantity * cartItem.productPrice).toFixed(2)}
                </p>
              </td>
              <td className="delete">
                <button onClick={() => handleDelete(cartItem.productId)}>
                  <Trash size={45} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {showConfirmDelete && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeInOut }}
            className="confirm-delete"
            ref={confirmDeleteRef}
          >
            <div className="text">
              <h2>Remove from cart</h2>
              <p>Are you sure you want to remove this item from your cart?</p>
            </div>
            <div className="button-container">
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};