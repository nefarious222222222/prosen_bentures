import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/cart.css";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import { CartItems } from "./components/cart-item";
import { Navigate, Link } from "react-router-dom";
import { ShoppingCart, Storefront } from "phosphor-react";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  let handleCheckout;
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

  return (
    <div className="container cart">
      {user.userRole !== "customer" ? <Navigate to="/" replace={true} /> : null}

      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart Items</h1>

          <div className="checkout">
            <p>
              <span>Sub Total: </span>Php 
            </p>

            <button
              className="checkOutButton"
              onClick={handleCheckout}
              disabled={totalPrice === 0}
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

        {cartItems.length == 0 ? (
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
        ) : (
          <div className="cart-items">
            <CartItems />
          </div>
        )}
      </div>
    </div>
  );
};
