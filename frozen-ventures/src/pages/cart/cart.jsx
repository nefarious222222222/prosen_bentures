import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/cart.css";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { OrderContext } from "../../context/order-context";
import { CartItems } from "./components/cart-item";
import { Navigate, Link } from "react-router-dom";
import { ShoppingCart, Storefront } from "phosphor-react";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const { setOrder } = useContext(OrderContext);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const updateSubTotal = (subTotal) => {
    setCartSubTotal(subTotal);
  };

  const handleCheckout = () => {
    console.log("Checkout button clicked");
  };

  return (
    <div className="container cart">
      {user.userRole !== "customer" ? <Navigate to="/" replace={true} /> : null}

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

        {cartItems ? (
          <div className="cart-items">
            <CartItems
              cartItems={cartItems}
              setCartItems={setCartItems}
              updateSubTotal={updateSubTotal}
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
