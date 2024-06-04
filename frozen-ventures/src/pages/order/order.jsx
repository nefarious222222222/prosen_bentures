import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/order.css";
import { OrderContext } from "../../context/order-context";
import { UserContext } from "../../context/user-context";
import { useNavigate } from "react-router-dom";

export const Order = () => {
  const { orderProducts, clearOrder } = useContext(OrderContext);
  const { user } = useContext(UserContext);
  const { products } = orderProducts || {};
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [formUserPersonal, setFormUserPersonal] = useState({
    firstName: "",
    lastName: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zip: "",
  });
  const [isEditingShippingMode, setIsEditingShippingMode] = useState(false);
  const [isEditingShippingDate, setIsEditingShippingDate] = useState(false);
  const [shippingAddressError, setShippingAddressError] = useState(false);
  const [shippingMode, setShippingMode] = useState("pickup");

  useEffect(() => {
    const fetchData = async () => {
      if (user?.accountId) {
        const userData = await getUserInfoById(user?.accountId);
        const userPersonal = await getUserPersonalInfoById(user?.accountId);

        if (userData && userPersonal) {
          const userEmail = userData.email;

          setFormUserPersonal({
            firstName: userPersonal.firstName,
            lastName: userPersonal.lastName,
            street: userPersonal.street,
            barangay: userPersonal.barangay,
            municipality: userPersonal.municipality,
            province: userPersonal.province,
            zip: userPersonal.zip,
          });

          setUserEmail(userEmail);
        }
      }
    };

    fetchData();
  }, [user?.accountId]);

  const handleEditUserInfo = () => {
    navigate("/user-menu");
  };

  const handleEditShippingAddress = () => {
    navigate("/user-menu");
  };

  let totalProductAmount = 0;

  if (products) {
    for (const productId in products) {
      const product = products[productId];
      totalProductAmount += product.productPrice * product.quantity;
    }
  }

  const shippingCost = shippingMode === "pickup" ? 0 : 10;
  const totalOrderCost =
    parseFloat(totalProductAmount) + parseFloat(shippingCost);

  const handleConfirmOrderShow = () => {
    if (isShippingAddressEmpty()) {
      setShippingAddressError(true);

      setTimeout(() => {
        setShippingAddressError(false);
      }, 2000);
    } else {
      setShowConfirmOrder(true);
    }
  };

  const handleConfirmOrderClose = () => {
    setShowConfirmOrder(false);
  };

  const handlePlaceOrder = async () => {
    try {
      if (isShippingAddressEmpty()) {
        setShippingAddressError(true);
        return;
      }

      let allOrdersCreated = true;

      for (const productId in products) {
        const product = products[productId];
        const orderId = await generateNewOrderId(userId);

        const productInfo = {
          productPrice: product.productPrice,
          productName: product.productName,
          productImage: product.productImage,
          shopName: product.shopName,
        };

        const orderInfo = {
          orderDate: product.orderDate,
          shippingMode: shippingMode,
          shippingDate: shippingDate,
          status: product.status,
          quantity: product.quantity,
          subTotal: product.subTotal,
        };

        const orderData = {
          ...orderInfo,
          [productId]: productInfo,
        };

        await createOrder(user.userRole, user.accountId, orderId, orderData);
      }

      if (allOrdersCreated) {
        setShowConfirmOrder(false);
        setShowSuccessMessage(true);

        setTimeout(() => {
          clearOrder();
          window.location.href = "/home";
        }, 1000);
      } else {
        console.log("Error placing order");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditShippingMode = () => {
    setIsEditingShippingMode(!isEditingShippingMode);
  };

  const handleShippingModeChange = (mode) => {
    setShippingMode(mode);
    setIsEditingShippingMode(false);
  };

  const handleEditShippingDate = () => {
    setIsEditingShippingDate(!isEditingShippingDate);
  };

  const handleShippingDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const formattedDate = selectedDate.toLocaleDateString();
    setShippingDate(formattedDate);
    setIsEditingShippingDate(false);
  };

  const isShippingAddressEmpty = () => {
    const { street, barangay, municipality, province, zip } = formUserPersonal;
    return !street || !barangay || !municipality || !province || !zip;
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate;
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate;
  };

  const [shippingDate, setShippingDate] = useState(getCurrentDate());

  useEffect(() => {
    const formattedDate = shippingDate.toLocaleDateString();
    setShippingDate(formattedDate);
  }, []);

  return (
    <div
      className="container order"
    >
      <header>
        <h2>Order Confirmation</h2>

        <div className="tb-container">
          {totalProductAmount > 0 ? (
            <>
              <p>
                Order Total: <span>Php {totalOrderCost.toFixed(2)}</span>
              </p>
              <button onClick={handleConfirmOrderShow}>Place Order</button>
            </>
          ) : null}
        </div>
      </header>

      <div className="informations">
        <div className="info">
          <div className="title-info">
            <h3>Your Information</h3>
            <button onClick={handleEditUserInfo}>Edit</button>
          </div>

          <h4>
            {formUserPersonal.firstName} {formUserPersonal.lastName}
          </h4>
          <p>{userEmail}</p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Address</h3>
            <button onClick={handleEditShippingAddress}>Edit</button>
          </div>

          <p>{formUserPersonal.street}</p>
          <p>{formUserPersonal.barangay}</p>
          <p>{formUserPersonal.municipality}</p>
          <p>{formUserPersonal.province}</p>
          <p>{formUserPersonal.zip}</p>
        </div>

        <div className="info">
          <div className="title-info">
            <h3>Shipping Mode</h3>
            <button onClick={handleEditShippingMode}>Edit</button>
          </div>
          {isEditingShippingMode ? (
            <div className="ship-group">
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("pickup")}
              >
                Pickup
              </button>
              <button
                className="ship-btn"
                onClick={() => handleShippingModeChange("delivery")}
              >
                Delivery
              </button>
            </div>
          ) : (
            <p>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}
            </p>
          )}
        </div>

        <div className="info">
          <div className="title-info">
            <h3>
              {shippingMode.charAt(0).toUpperCase() + shippingMode.slice(1)}{" "}
              Date
            </h3>
            <button onClick={handleEditShippingDate}>Edit</button>
          </div>
          {isEditingShippingDate ? (
            <input
              className="ship-date"
              type="date"
              min={getCurrentDate()}
              max={getMaxDate()}
              value={getCurrentDate()}
              onChange={handleShippingDateChange}
            />
          ) : (
            <p>{shippingDate}</p>
          )}
        </div>
      </div>

      <div className="item-container">
        <h2>Order Items</h2>

        <div className="order-item">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Retailer</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products &&
                Object.entries(products).map(([productId, product]) => (
                  <tr key={productId}>
                    <td>
                      <img
                        src={product.productImage}
                        alt={product.productName}
                      />
                      <p>{product.productName}</p>
                    </td>
                    <td>
                      <p>{product.shopName}</p>
                    </td>
                    <td>
                      <p>{product.quantity}</p>
                    </td>
                    <td>
                      <p>
                        Php{" "}
                        {(product.productPrice * product.quantity).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="t-container">
        <div className="total-container">
          <h2>Total Cost</h2>
          <div className="sub-total">
            <p className="label">Sub Total</p>
            <p className="price">Php {totalProductAmount.toFixed(2)}</p>
          </div>
          <div className="shipping">
            <p className="label">Shipping</p>
            <p className="price">Php {shippingCost.toFixed(2)}</p>
          </div>
          <div className="line"></div>
          <div className="total">
            <p className="label">Total</p>
            <p className="price">Php {totalOrderCost.toFixed(2)}</p>
          </div>
          <button onClick={handleConfirmOrderShow}>Place Order</button>{" "}
        </div>
      </div>
    </div>
  );
};
