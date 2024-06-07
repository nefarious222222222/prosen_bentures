import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";
import { ActiveItemContext } from "../../../context/notification-context";

export const Notifications = () => {
  const { user } = useContext(UserContext);
  const { setActiveItem } = useContext(ActiveItemContext);
  const [productsBelow20, setProductsBelow20] = useState([]);

  const handleNotificationClick = () => {
    setActiveItem("manage-inventory");
  };

  return (
    <div className="notifications">
      <h1>Notifications</h1>
      <div className="notification-container">
        {productsBelow20.length > 0
          ? productsBelow20.map((product) => (
              <div
                className="notification"
                key={product.productId}
                onClick={handleNotificationClick}
              >
                <div className="header">
                  <p>
                    <span>Product ID:</span> {product.productId}
                  </p>
                </div>
                <div className="body">
                  <img src={product.productImage} />
                  <p>
                    The product <span>{product.productName}</span> has only{" "}
                    <span>{product.productStock}</span> items remaining in
                    stock.
                  </p>
                </div>
                <div className="footer">
                  <WarningCircle size={25} color="rgb(114, 17, 17)" />
                  <p>WARNING LOW STOCK</p>
                </div>
              </div>
            ))
          : <p className="notif-empty">Nothing here...</p>}
      </div>
    </div>
  );
};
