import React, { useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import "../assets/styles/components.css";
import logo from "../assets/images/logo.jpg";
import { Link, useLocation } from "react-router-dom";
import {
  Storefront,
  ShoppingCart,
  ClockCounterClockwise,
  UserCircle,
} from "phosphor-react";

export const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const userRole = user?.userRole;

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
    </div>
  );
};
