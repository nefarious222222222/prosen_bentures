import React, { useContext } from "react";
import { ActiveItemContext } from "../../../context/notification-context";
import { WarningCircle } from "phosphor-react";

export const Notifications = React.forwardRef(({ productsBelow20 }, ref) => {
  const { setActiveItem } = useContext(ActiveItemContext);

  const handleNotificationClick = () => {
    setActiveItem("manage-inventory");
  };

  return (
    <div className="notifications" ref={ref}>
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
                    <span>Product ID:</span> {product.productID}
                  </p>
                </div>
                <div className="body">
                  <img
                    src={`http://localhost/prosen_bentures/api/productImages/${product.productImage}`}
                    alt={`${product.productName}`}
                  />
                  <p>
                    The product <span>{product.productName} {product.productSize}</span> has only{" "}
                    <span>{product.productStock}</span> items remaining in stock.
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
});