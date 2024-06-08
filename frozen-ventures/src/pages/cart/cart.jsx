import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/cart.css";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { OrderContext } from "../../context/order-context";
import { CartItems } from "./components/cart-item";
import { Navigate, Link } from "react-router-dom";
import { ShoppingCart, Storefront } from "phosphor-react";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";
import { ConfirmationPopUp } from "../../components/confirmation-popup";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const { setOrder, clearOrder } = useContext(OrderContext);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [orderSet, setOrderSet] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [cartItemError, setCartItemError] = useState(false);
  const [errorProduct, setErrorProduct] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/manageCart.php?accountId=${user.accountId}`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user.accountId, setCartItems]);

  const updateSubTotal = (subTotal) => {
    setCartSubTotal(subTotal);
  };

  const handleCheckout = async () => {
    try {
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const orderDetails = {
        products: cartItems.reduce((acc, curr) => {
          const subTotal =
            parseFloat(curr.productPrice) * parseInt(curr.quantity);
          if (curr.quantity > curr.productStock) {
            setErrorProduct(curr.productName);
            setCartItemError(true);

            setTimeout(() => {
              setCartItemError(false);
              setErrorProduct(null);
            }, 3000);

            throw new Error(
              `Quantity for ${curr.productName} exceeds available stock.`
            );
          }

          acc[curr.productID] = {
            productId: curr.productID,
            priceId: curr.priceID,
            shopId: curr.shopID,
            productImage: curr.productImage,
            productBrand: curr.productBrand,
            productName: curr.productName,
            productFlavor: curr.productFlavor,
            productSize: curr.productSize,
            productPrice: curr.productPrice,
            quantity: curr.quantity,
            shopName: curr.shopName,
            subTotal: subTotal.toFixed(2),
            status: "pending",
            orderDate: currentDate,
          };
          return acc;
        }, {}),
      };

      setOrder(orderDetails);
      console.log("asdas",orderDetails)
      setOrderSet(true);
    } catch (error) {
      console.error("Error during checkout:", error.message);
      setErrorMessage("There was an error during checkout. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleQuantityChange = (
    productId,
    priceId,
    newQuantity,
    productPrice,
    productStock
  ) => {
    const newTotalPrice = Number(productPrice * newQuantity).toFixed(2);

    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.productID === productId && cartItem.priceID === priceId
          ? {
              ...cartItem,
              quantity: Math.min(
                Math.max(1, newQuantity),
                cartItem.productStock
              ),
              totalPrice: Number(productPrice * newQuantity).toFixed(2),
            }
          : cartItem
      )
    );
    axios
      .put(`http://localhost/prosen_bentures/api/manageCart.php`, {
        accountId: user.accountId,
        productId,
        priceId,
        totalPrice: newTotalPrice,
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

  const handleDeleteClick = (productId, priceId, productName) => {
    setSelectedItemId({ productId, priceId });
    setSelectedProductName(productName);
    setShowConfirmationPopUp(true);
  };

  const handleCancelClick = () => {
    setSelectedItemId([]);
    setSelectedProductName("");
    setShowConfirmationPopUp(false);
  };

  const handleConfirmDeleteClick = () => {
    axios
      .delete(`http://localhost/prosen_bentures/api/manageCart.php`, {
        data: {
          accountId: user.accountId,
          productId: selectedItemId.productId,
          priceId: selectedItemId.priceId,
        },
      })
      .then((response) => {
        if (response.data.status === 1) {
          setCartItems((prevCartItems) =>
            prevCartItems.filter(
              (cartItem) =>
                !(
                  cartItem.productID === selectedItemId.productId &&
                  cartItem.priceID === selectedItemId.priceId
                )
            )
          );
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        setErrorMessage("Failed to remove product from cart");
      });
    setShowConfirmationPopUp(false);
    setSelectedItemId(null);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 2000);
  };

  if (orderSet) {
    return <Navigate to="/order" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    user.userRole !== "customer" &&
    user.userRole !== "retailer" &&
    user.userRole !== "distributor"
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container cart">
      {cartItemError && (
        <ErrorMessage
          message={`Quantity for ${errorProduct} exceeds available stock`}
        />
      )}
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

      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart Items</h1>

          <div className="checkout">
            <p>
              <span>Sub Total: </span>Php {cartSubTotal.toFixed(2)}
            </p>

            <button
              className="checkOutButton"
              onClick={handleCheckout}
              disabled={cartSubTotal === 0}
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="cart-item">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Remove</th>
              </tr>
            </thead>
          </table>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-items">
            <CartItems
              cartItems={cartItems}
              handleQuantityChange={handleQuantityChange}
              updateSubTotal={updateSubTotal}
              handleDeleteClick={handleDeleteClick}
            />
          </div>
        ) : (
          <div key="empty-cart" className="empty-cart">
            <div className="message-one">
              <span>
                <ShoppingCart size={50} />
              </span>
              <h2>
                Your <span>cart</span> is empty
              </h2>
            </div>

            <div className="message-two">
              <p>
                <span>Venture</span> into the <span>product catalog</span>, and
                maybe you'll find something <span>frosty</span>.
              </p>
              <Link to="/shop">
                <button>
                  <Storefront size={32} />
                  Browse Shop
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
