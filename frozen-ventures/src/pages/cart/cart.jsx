import React, { useContext, useState } from "react";
import "../../assets/styles/cart.css";
import { UserContext } from "../../context/user-context";
import { Navigate, Link } from "react-router-dom";
import { ShoppingCart, Storefront } from "phosphor-react";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderSet, setOrderSet] = useState(false);

  let handleCheckout;

  return (
    <div className="container cart">
      {user.userRole !== "customer" ? <Navigate to="/" replace={true} /> : null}

      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart Items</h1>

          <div className="checkout">
            <p>
              <span>Sub Total: </span>Php {totalPrice.toFixed(2)}
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

        <div className="cart-items">
          CART ITEM HERE
        </div>
      </div>

      {totalPrice === 0 && (
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
  );
};
