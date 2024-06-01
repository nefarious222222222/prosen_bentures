import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../../context/user-context";
import { OrderContext } from "../../../../context/order-context";
import { Minus, Plus, UserCircle, ArrowRight, WarningCircle } from "phosphor-react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import "../../../../assets/styles/shop.css";

export const Shop = () => {
  const { user } = useContext(UserContext);
  const { setOrder } = useContext(OrderContext);
  const userRole = user.userRole;
  const userId = user?.userId;

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [orderSet, setOrderSet] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post("http://localhost/api/fetchProducts.php", { userRole });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [userRole]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleBuyProduct = async () => {
    try {
      const currentDate = dayjs().format("MMMM D, YYYY");

      const orderDetails = {
        products: {
          [selectedProduct.productId]: {
            productImage: selectedProduct.productImage,
            productName: selectedProduct.productName,
            productPrice: selectedProduct.productPrice,
            quantity: quantity,
            shopName: selectedProduct.shopName,
            subTotal: (selectedProduct.productPrice * quantity).toFixed(2),
            status: "pending",
            orderDate: currentDate,
          },
        },
      };

      setOrder(orderDetails);
      setOrderSet(true);
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }
    if (selectedProduct.productStock > 0) {
      try {
        await axios.post("http://localhost/api/addToCart.php", {
          userRole,
          userId,
          productId: selectedProduct.productId,
          quantity,
          productPrice: selectedProduct.productPrice,
          productName: selectedProduct.productName,
          shopName: selectedProduct.shopName,
          productImage: selectedProduct.productImage,
          productStock: selectedProduct.productStock,
        });
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      setShowErrorNotification(true);
      setTimeout(() => setShowErrorNotification(false), 2000);
    }
  };

  const handleIncrement = () => {
    if (quantity < selectedProduct.productStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= selectedProduct.productStock) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClosePopup();
      }
    };

    if (selectedProduct) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProduct]);

  if (orderSet) {
    return <Navigate to="/order" replace />;
  }

  return (
    <div className="shop-reseller">
      <div className="search-bar">
        <h1>Shop</h1>
        <input type="text" placeholder="Search" />
      </div>

      <div className="product-container">
        {products.map((product) => (
          <div key={product.productId}>
            <div
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <img src={product.productImage} alt={product.productName} />
              <div className="product-box">
                <div className="product-info">
                  <div className="info-group">
                    <p className="name">{product.productName}</p>
                    <p>{product.shopName}</p>
                  </div>
                  <div className="info-group">
                    <p className="price">Php {product.productPrice}</p>
                    <p>{product.productSize}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="popup">
          <div className="popup-content" ref={popupRef}>
            <div className="header">
              <div className="seller">
                <UserCircle size={60} />
                <p>{selectedProduct.shopName}</p>
              </div>
              <ArrowRight size={50} />
            </div>

            <div className="product">
              <img src={selectedProduct.productImage} alt={selectedProduct.productName} />

              <div className="product-info">
                <div className="info">
                  <p className="name">{selectedProduct.productName}</p>
                  <p className="price">Php {selectedProduct.productPrice}</p>
                </div>

                <div className="info">
                  <div className="group">
                    <p>
                      <span>Flavor:</span> {selectedProduct.productName}
                    </p>
                    <p>
                      <span>Size:</span> {selectedProduct.productSize}
                    </p>
                    <p>
                      <span>Stocks:</span> {selectedProduct.productStock}
                    </p>
                  </div>

                  <div className="quantity-container">
                    <span>Quantity:</span>

                    <div className="quantity">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                      >
                        <Minus size={25} />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleInputChange}
                        min="1"
                        max={selectedProduct.productStock}
                      />
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= selectedProduct.productStock}
                      >
                        <Plus size={25} />
                      </button>
                    </div>
                  </div>

                  <p className="description">{selectedProduct.productDescription}</p>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button onClick={handleClosePopup}>Cancel</button>
              <div className="group">
                <button onClick={handleAddToCart}>Add to Cart</button>
                <button onClick={handleBuyProduct}>Buy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showNotification && selectedProduct && (
          <m.div
            className="notify success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WarningCircle size={50} />
            <p>
              <span>{selectedProduct.productName}</span> has been added to your cart.
            </p>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showErrorNotification && selectedProduct && (
          <m.div
            className="notify error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WarningCircle size={50} />
            <p>
              <span>{selectedProduct.productName}</span> is out of stock.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
