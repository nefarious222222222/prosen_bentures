import React, { useState } from "react";
import "../../assets/styles/sign.css"
import { Link } from "react-router-dom";
import { SignIn } from "./components/sign-in";
import { SignUp } from "./components/sign-up";
import Logo from "../../assets/images/logo.jpg";

export const Sign = () => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [activeButton, setActiveButton] = useState("signIn");

  const handleSignInClick = () => {
    setShowSignIn(true);
    setActiveButton("signIn");
  };

  const handleSignUpClick = () => {
    setShowSignIn(false);
    setActiveButton("signUp");
  };

  return (
    <div className="container sign">
      <div className="sign-container">
        <header>
          <Link to="/">
            <div className="title">
              <img src={Logo} alt="Logo" />
              <h1>FrozenVentures</h1>
            </div>
          </Link>

          <div className="button-container">
            <button
              className={activeButton === "signIn" ? "active" : ""}
              onClick={handleSignInClick}
            >
              SIGN IN
            </button>
            <button
              className={activeButton === "signUp" ? "active" : ""}
              onClick={handleSignUpClick}
            >
              SIGN UP
            </button>
          </div>
        </header>

        {showSignIn ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
};
