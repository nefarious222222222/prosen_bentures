import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user-context";
import "../../assets/styles/seller.css";
import axios from "axios";
import { ShopPerformance } from "./components/shop-performance";
import { ManageOrder } from "./components/manage-order";
import { ManageProducts } from "./components/manage-products";
import { ManageInventory } from "./components/manage-inventory";
import { ManageShop } from "./components/manage-shop";
import { useNavigate } from "react-router-dom";
import { ActiveItemContext } from "../../context/notification-context";
import {
  Gauge,
  Truck,
  Coin,
  Cube,
  Kanban,
  Envelope,
  CaretRight,
  CaretLeft,
} from "phosphor-react";

export const HomeSeller = () => {
  const { user } = useContext(UserContext);
  const { activeItem, setActiveItem } = useContext(ActiveItemContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user.userRole !== "retailer" &&
      user.userRole !== "distributor" &&
      user.userRole !== "manufacturer"
    ) {
      navigate("/");
    } else if (user.shopVerified !== "1") {
      setIsOverlayVisible(true);
    } else {
      setIsOverlayVisible(false);
    }
  }, [user.userRole, user.shopVerified, navigate]);

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
            className={activeItem === "shop-performance" ? "active" : ""}
            onClick={() => handleItemClick("shop-performance")}
            data-tooltip="Shop Performance"
          >
            <Gauge size={40} />
            {isExpanded && <p>Shop Performance</p>}
          </li>
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
        {activeItem === "shop-performance" && <ShopPerformance />}
        {activeItem === "manage-order" && <ManageOrder />}
        {activeItem === "manage-products" && <ManageProducts />}
        {activeItem === "manage-inventory" && <ManageInventory />}
        {activeItem === "manage-shop" && <ManageShop />}
      </div>

      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Your shop is not yet verified</h2>
            <p>
              Please go to settings to set up your shop. If you've already done
              so, kindly wait
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
