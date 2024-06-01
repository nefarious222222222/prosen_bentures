import React, { useContext, useState, useEffect } from "react";
import "../../../assets/styles/reseller.css";
import { UserContext } from "../../context/user-context";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { ShopPerformance } from "./components/shop-performance";
import { Shop } from "./components/shop";
import { Cart } from "./components/cart";
import { History } from "./components/history";
import { ManageOrder } from "./components/manage-order";
import { ManageProducts } from "./components/manage-products";
import { ManageInventory } from "./components/manage-inventory";
import { Inbox } from "./components/inbox";
import axios from "axios";

export const HomeSeller = () => {
  const { user } = useContext(UserContext);
  const { userSignedIn } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState("performance");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.post(
            "http://localhost/api/checkUserStatus.php",
            { userId: user.userId }
          );
          if (response.data.status === "pending") {
            setIsOverlayVisible(true);
          } else {
            setIsOverlayVisible(false);
          }
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [user]);

  const handleActiveItemChange = (item) => {
    setActiveItem(item);
  };

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  if (
    !userSignedIn ||
    (userSignedIn &&
      user.userRole !== "Retailer" &&
      user.userRole !== "Distributor" &&
      user.userRole !== "Manufacturer")
  ) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <div className="container home-retailer">
      {isOverlayVisible && (
        <div className="overlay">
          <div className="message-container">
            <h1>Warning</h1>
            <p>
              Your account is not yet verified. Please wait for the
              administrator to verify your account.
            </p>
          </div>
        </div>
      )}
      <Sidebar
        activeItem={activeItem}
        onActiveItemChange={handleActiveItemChange}
        onToggle={handleSidebarToggle}
      />
      <div
        className="sidebar-content"
        style={{ marginLeft: isSidebarExpanded ? "15vw" : "5vw" }}
      >
        {activeItem === "performance" && <ShopPerformance />}
        {activeItem === "shop" && <Shop />}
        {activeItem === "cart" && <Cart />}
        {activeItem === "history" && <History />}
        {activeItem === "manage-order" && <ManageOrder />}
        {activeItem === "manage-products" && <ManageProducts />}
        {activeItem === "manage-inventory" && <ManageInventory />}
        {activeItem === "inbox" && <Inbox />}
      </div>
    </div>
  );
};
