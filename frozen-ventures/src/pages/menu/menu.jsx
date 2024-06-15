import React, { useContext, useState, useEffect, forwardRef } from "react";
import axios from "axios";
import "../../assets/styles/menu.css";
import { UserContext } from "../../context/user-context";
import { ConfirmationPopUp } from "../../components/confirmation-popup";
import { useNavigate } from "react-router-dom";
import {
  FolderPlus,
  ShoppingCart,
  ClockCounterClockwise,
  SignOut as SignOutIcon,
  UserCircle,
  Storefront,
} from "phosphor-react";

export const Menu = forwardRef((props, ref) => {
  const { user, clearUser } = useContext(UserContext);
  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    profileImage: "",
  });
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost/prosen_bentures/api/managePersonalInfo.php?accountId=${user.accountId}`
      )
      .then((response) => {
        const userData = response.data;
        setAccount({
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImage: userData.profileImage,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [user.accountId]);

  const handleSignOutCancel = () => {
    setShowSignOutPopup(false);
  };

  const handleYourShopClick = () => {
    navigate("/setup-shop");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleCustomizeOrderClick = () => {
    navigate("/customize-order");
  };

  const handleCartClick = () => {
    if (user.userRole == "customer") {
      navigate("/cart");
    } else if (user.userRole == "retailer" || user.userRole == "distributor") {
      navigate("/seller-cart");
    }
  };

  const handleHistoryClick = () => {
    if (user.userRole == "customer") {
      navigate("/history");
    } else if (user.userRole == "retailer" || user.userRole == "distributor") {
      navigate("/seller-history");
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutPopup(true);
  };

  const handleSignOutConfirm = () => {
    clearUser();
    navigate("/");
    setShowSignOutPopup(false);
  };

  return (
    <div className="menu" ref={ref}>
      {showSignOutPopup && (
        <ConfirmationPopUp
          confirmTitle="Sign Out"
          confirmMessage="Would you like to sign out?"
          handleConfirm={handleSignOutConfirm}
          handleCancel={handleSignOutCancel}
        />
      )}

      <ul className="menu-list">
        {account ? (
          <li className="first-menu">
            <div className="account-container">
              {account.profileImage == "" ? (
                <UserCircle size={40} />
              ) : (
                <img
                  src={`http://localhost/prosen_bentures/api/profileImages/${account.profileImage}`}
                />
              )}
              <p>
                {account.firstName} {account.lastName}
              </p>
            </div>

            <p onClick={handleProfileClick}>Show Profile</p>
          </li>
        ) : (
          <li>
            <UserCircle size={40} />
            <p>Show Profile</p>
          </li>
        )}
        {(user.userRole === "retailer" ||
          user.userRole === "distributor" ||
          user.userRole === "manufacturer") && (
          <li onClick={handleYourShopClick}>
            <Storefront size={40} />
            <p>Your Shop</p>
          </li>
        )}
        {user.userRole == "customer" && (
          <li onClick={handleCustomizeOrderClick}>
            <FolderPlus size={40} />
            <p>Customize Order</p>
          </li>
        )}
        <li onClick={handleCartClick}>
          <ShoppingCart size={40} />
          <p>Cart</p>
        </li>
        <li onClick={handleHistoryClick}>
          <ClockCounterClockwise size={40} />
          <p>Purchase History</p>
        </li>
        <li onClick={handleSignOutClick}>
          <SignOutIcon size={40} />
          <p>Sign Out</p>
        </li>
      </ul>
    </div>
  );
});
