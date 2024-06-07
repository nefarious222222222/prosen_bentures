import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user-context";
import "../assets/styles/components.css";
import logo from "../assets/images/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import {
  Storefront,
  ShoppingCart,
  ClockCounterClockwise,
  UserCircle,
  Bell,
} from "phosphor-react";
import { Notifications } from "../pages/seller/components/notifications";

export const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [productsBelow20, setProductsBelow20] = useState([]);
  const userRole = user?.userRole;

  useEffect(() => {
    setProductsBelow20([1,2,3]);
    console.log(productsBelow20)
  }, [])
  

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  if (location.pathname === "/sign" || location.pathname === "/splash") {
    return null;
  }

  return (
    <div className="navbar">
      <div className="title-container">
        <Link
          className="link-container"
          to={userRole === "retailer" ? "/home-seller" : "/"}
        >
          <img src={logo} alt="Sharsh" />
          <p className="link title">FrozenVentures</p>
        </Link>
      </div>

      <input type="text" placeholder="Search" />

      <div className="links">
        {userRole == null || userRole == "customer" ? (
          <Link to="/shop" title="Shop">
            <Storefront className="link fake-button" size={32} color={"#fff"} />
          </Link>
        ) : null}

        {userRole === "customer" ? (
          <>
            <Link to="/cart" title="Cart">
              <ShoppingCart
                className="link fake-button"
                size={30}
                color={"#fff"}
              />
            </Link>

            <Link to="/history" title="History">
              <ClockCounterClockwise
                className="link fake-button"
                size={30}
                color={"#fff"}
              />
            </Link>
          </>
        ) : null}

        {user.accountId && user.userRole === "retailer" ? (
          <div
            className={`notif-container ${
              productsBelow20.length > 0 ? "has-notifications" : ""
            }`}
          >
            <Bell
              className={"link fake-button"}
              size={30}
              color={"#fff"}
              onClick={toggleNotifications}
            />
            {productsBelow20.length > 0 && <div className="red-dot"></div>}
          </div>
        ) : null}

        {userRole != null ? (
          <Link to="/menu" title="Menu">
            <UserCircle className="link fake-button" size={40} color="white" />
          </Link>
        ) : (
          <Link to="/sign">
            <button>Sign In</button>
          </Link>
        )}
      </div>
      {showNotifications && <Notifications />}
    </div>
  );
};
