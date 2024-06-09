import React, { useContext } from "react";
import { Shops } from "../../../shops";
import { UserContext } from "../../../context/user-context";
import "../../../assets/styles/seller.css"

export const SellerShop = () => {
  const { user } = useContext(UserContext);

  let shopType;
  if (user?.userRole == "retailer") {
    shopType = "Distributor";
  } else if (user?.userRole == "distributor") {
    shopType = "Manufacturer";
  }

  return (
    <div className="container seller-shop">
      <h1>List of {shopType}</h1>

      <div className="shops-container">
        <Shops />
      </div>
    </div>
  );
};
