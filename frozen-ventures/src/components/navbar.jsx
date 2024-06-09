import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/user-context";
import "../assets/styles/components.css";
import axios from "axios";
import { Notifications } from "../pages/seller/components/notifications";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import {
  Storefront,
  ShoppingCart,
  ClockCounterClockwise,
  UserCircle,
  Bell,
  FolderPlus,
  HouseSimple,
} from "phosphor-react";

export const Navbar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [productsBelow20, setProductsBelow20] = useState([]);
  const userRole = user?.userRole;
  const notifContainerRef = useRef(null);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      if (user?.shopId && userRole) {
        try {
          const response = await axios.get(
            "http://localhost/prosen_bentures/api/getProductsBelow20.php",
            {
              params: {
                shopId: user.shopId,
                userRole: userRole,
              },
            }
          );

          const data = response.data;
          if (Array.isArray(data) && data.length > 0) {
            const lowStockProducts = data.filter((product) => {
              if (userRole === "retailer") return product.productStock <= 20;
              if (userRole === "distributor") return product.productStock <= 50;
              if (userRole === "manufacturer")
                return product.productStock <= 100;
              return false;
            });
            setProductsBelow20(lowStockProducts);
          } else {
            setProductsBelow20([]);
          }
        } catch (error) {
          console.error("Error fetching low stock products:", error);
        }
      }
    };

    const interval = setInterval(() => {
      fetchLowStockProducts();
    }, 5000);
    fetchLowStockProducts();

    return () => clearInterval(interval);
  }, [user?.shopId, userRole]);

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifContainerRef]);

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
            <Link to="/customize-order" title="Customize Order">
              <FolderPlus
                className="link fake-button"
                size={30}
                color={"#fff"}
              />
            </Link>

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

        {userRole === "retailer" || userRole === "distributor" ? (
          <>
            <Link to="/home-seller" title="Home">
              <HouseSimple
                className="link fake-button"
                size={32}
                color={"#fff"}
              />
            </Link>

            <Link to="/seller-shop" title="Shop">
              <Storefront
                className="link fake-button"
                size={32}
                color={"#fff"}
              />
            </Link>

            <Link to="/seller-cart" title="Cart">
              <ShoppingCart
                className="link fake-button"
                size={30}
                color={"#fff"}
              />
            </Link>

            <Link to="/seller-history" title="History">
              <ClockCounterClockwise
                className="link fake-button"
                size={30}
                color={"#fff"}
              />
            </Link>
          </>
        ) : null}

        {user?.accountId && user?.userRole === "retailer" ? (
          <>
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

            {showNotifications && (
              <Notifications
                ref={notifContainerRef}
                productsBelow20={productsBelow20}
              />
            )}
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
