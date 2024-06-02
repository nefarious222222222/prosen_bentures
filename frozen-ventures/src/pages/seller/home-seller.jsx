import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user-context";
import "../../assets/styles/seller.css";
import { ShopPerformance } from "./components/shop-performance";
import { ManageProducts } from "./components/manage-products";
import { useNavigate } from "react-router-dom";
import {
  Gauge,
  Storefront,
  Truck,
  ClockCounterClockwise,
  Coin,
  Cube,
  Kanban,
  Envelope,
  CaretRight,
  CaretLeft,
  ShoppingCart,
} from "phosphor-react";

export const HomeSeller = () => {
  const { user } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState("shop-performance");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user.userRole !== "retailer" &&
      user.userRole !== "distributor" &&
      user.userRole !== "manufacturer"
    ) {
      navigate("/");
    }
  }, [user.userRole, navigate]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="container seller">
      <div className={`side-bar ${isExpanded ? "expanded" : ""}`}>
        {isExpanded ? (
          <CaretLeft
            className="toggle-sidebar"
            size={30}
            onClick={toggleSidebar}
          />
        ) : (
          <CaretRight
            className="toggle-sidebar"
            size={30}
            onClick={toggleSidebar}
          />
        )}
        <ul>
          <li
            className={activeItem === "performance" ? "active" : ""}
            onClick={() => handleItemClick("performance")}
            data-tooltip="Shop Performance"
          >
            <Gauge size={40} />
            {isExpanded && <p>Shop Performance</p>}
          </li>
          {user.userRole !== "manufacturer" && (
            <>
              <li
                className={activeItem === "shop" ? "active" : ""}
                onClick={() => handleItemClick("shop")}
                data-tooltip="Shop"
              >
                <Storefront size={40} />
                {isExpanded && <p>Shop</p>}
              </li>
              <li
                className={activeItem === "cart" ? "active" : ""}
                onClick={() => handleItemClick("cart")}
                data-tooltip="Cart"
              >
                <ShoppingCart size={40} />
                {isExpanded && <p>Cart</p>}
              </li>
              <li
                className={activeItem === "history" ? "active" : ""}
                onClick={() => handleItemClick("history")}
                data-tooltip="History"
              >
                <ClockCounterClockwise size={40} />
                {isExpanded && <p>History</p>}
              </li>
            </>
          )}
          <li
            className={activeItem === "manage-order" ? "active" : ""}
            onClick={() => handleItemClick("manage-order")}
            data-tooltip="Manage Order"
          >
            <Truck size={40} />
            {isExpanded && <p>Manage Order</p>}
          </li>
          <li
            className={activeItem === "manage-products" ? "active" : ""}
            onClick={() => handleItemClick("manage-products")}
            data-tooltip="Manage Products"
          >
            <Coin size={40} />
            {isExpanded && <p>Manage Product</p>}
          </li>
          <li
            className={activeItem === "manage-inventory" ? "active" : ""}
            onClick={() => handleItemClick("manage-inventory")}
            data-tooltip="Manage Inventory"
          >
            <Cube size={40} />
            {isExpanded && <p>Manage Inventory</p>}
          </li>
          <li
            className={activeItem === "manage-shop" ? "active" : ""}
            onClick={() => handleItemClick("manage-shop")}
            data-tooltip="Manage Shop"
          >
            <Kanban size={40} />
            {isExpanded && <p>Manage Shop</p>}
          </li>
          <li
            className={activeItem === "inbox" ? "active" : ""}
            onClick={() => handleItemClick("inbox")}
            data-tooltip="Inbox"
          >
            <Envelope size={40} />
            {isExpanded && <p>Inbox</p>}
          </li>
        </ul>
      </div>

      <div
        className="selected-item"
        style={{ marginLeft: isExpanded ? "15vw" : "5vw" }}
      >
        {activeItem === "performance" && <ShopPerformance />}
        {activeItem === "manage-products" && <ManageProducts />}
      </div>
    </div>
  );
};
