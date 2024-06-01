import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/user-context";
import { OrderContext } from "../../../../context/order-context";
import { CartItem } from "../../../cart/components/cart-item";
import { ShoppingCart, Storefront } from "phosphor-react";
import { AnimatePresence, motion as m } from "framer-motion";
import axios from 'axios';
import dayjs from "dayjs";

export const Cart = () => {
  const { user } = useContext(UserContext);
  const { setOrder } = useContext(OrderContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderSet, setOrderSet] = useState(false);
  const [cartItemError, setCartItemError] = useState(false);
  const [errorProduct, setErrorProduct] = useState(null);

  useEffect(() => {
    // Calculate total price whenever products change
    const total = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
    setTotalPrice(total);
  }, [products]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/path_to_php/checkout.php', {
        userId: user.userId,
        products: products,
        totalPrice: totalPrice,
        orderDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      });

      if (response.data.success) {
        setOrder(response.data.order);
        setOrderSet(true);
        setProducts([]);
        setTotalPrice(0);
      } else {
        setCartItemError(true);
        setErrorProduct(response.data.errorProduct);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCartItemError(true);
    }
  };

  return (
    <div className="cart-reseller">
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
            <tbody>
              {products.map((product, index) => (
                <CartItem
                  key={index}
                  product={product}
                  setTotalPrice={setTotalPrice}
                  setProducts={setProducts}
                />
              ))}
            </tbody>
          </table>
        </div>

        {totalPrice === 0 && (
          <AnimatePresence>
            <m.div
              key="empty-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: easeInOut }}
              className="empty-cart"
            >
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

                <button>
                  <Storefront size={32} />
                  Browse Shop
                </button>
              </div>
            </m.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {cartItemError && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="error-message"
          >
            <div className="header">
              <h2>Checkout Error</h2>
              <p>Quantity for {errorProduct} exceeds available stock</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
