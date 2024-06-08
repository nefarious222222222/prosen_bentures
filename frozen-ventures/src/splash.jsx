import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/user-context";
import "./assets/styles/splash.css";
import Logo from "./assets/images/logo.jpg";
import { useNavigate } from "react-router-dom";
import { WhisperSpinner } from "react-spinners-kit";

export const Splash = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const navigateToHome = () => {
      if (user?.userRole === "admin") {
        navigate("/home-admin");
      } else if (
        user?.userRole === "retailer" ||
        user?.userRole === "distributor" ||
        user?.userRole === "manufacturer"
      ) {
        navigate("/home-seller");
      } else {
        navigate("/");
      }
    };

    setTimeout(navigateToHome, 3000);
  }, [navigate, user]);

  return (
    <div className="loading">
      <div className="header">
        <img src={Logo} alt="FrozenVentures Logo" />
        <p>FrozenVentures</p>
      </div>
      <WhisperSpinner size={200} loading={loading} />
    </div>
  );
};