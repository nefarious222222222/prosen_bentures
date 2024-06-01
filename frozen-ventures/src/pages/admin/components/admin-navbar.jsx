import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.jpg";
import { UserList, CheckCircle, UserPlus } from "phosphor-react";


  return (
    <div className="navbar">
      <div className="title-container">
        <Link className="link-container" to="/admin">
          <img src={logo} alt="Sharsh" />
          <p className="link title">FrozenVentures</p>
        </Link>
      </div>

      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "var(--color-violet)",
        }}
      >
        Administration Account
      </h1>

      <div className="links">
        <Link to="/admin/user-list">
          <UserList className="link fake-button" size={35} color={"#fff"} />
        </Link>

        <Link to="/admin/verify-docs">
          <CheckCircle
            className="link fake-button"
            size={35}
            color={"#fff"}
          />
        </Link>

        <Link to="/admin/add-user">
          <UserPlus className="link fake-button" size={35} color={"#fff"} />
        </Link>

        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};
