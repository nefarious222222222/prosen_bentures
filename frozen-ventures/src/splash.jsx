import React, { useContext, useState, useEffect } from "react";
import "./assets/styles/splash.css";
import Logo from "./assets/images/logo.jpg";
import { UserContext } from "./context/user-context";
import { WhisperSpinner } from "react-spinners-kit";

export const Splash = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (user.userRole == "admin") {
        setTimeout(() => {
          window.location.href = "/admin";
        }, 3000);
      } else if (user.userRole == "retailer" || user.userRole == "distributor" || user.userRole == "manufacturer") {
        setTimeout(() => {
          window.location.href = "/home-reseller";
        }, 3000);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    } catch {
      setTimeout(() => {
        window.location.href = "/home";
      }, 3000);
    }
  }, []);

  return (
    <div
      className="loading"
    >
      
      <div className="header">
        <img src={Logo} />
        <p>FrozenVentures</p>
      </div>
      <WhisperSpinner
        size={200}
        color="#533d70"
        frontColor="#533d70"
        backColor="#533d70"
        loading={loading}
      />
    </div>
  );
};
