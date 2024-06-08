import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./assets/styles/shops.css";
import { UserContext } from "./context/user-context";

export const Shops = () => {
  const { user } = useContext(UserContext);
  const [shops, setShops] = useState([]);

  let shopType = "";
  if (user?.userRole === "customer" || user?.userRole === "") {
    shopType = "retailer";
  } else if (user?.userRole === "retailer") {
    shopType = "distributor";
  } else if (user?.userRole === "distributor") {
    shopType = "manufacturer";
  } else {
    shopType = "retailer";
  }

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/getShopsByRole.php?shopType=${shopType}`
        );
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
        setError("Error fetching shops");
      }
    };

    fetchShops();
  }, [shopType]);

  console.log(shops);
  return (
    <>
      {shops.map((shop) => (
        <div key={shop.id} className="individual-shops">
          <img
            src={`http://localhost/prosen_bentures/api/${shop.shopLogo}`}
            alt={shop.shopName}
          />

          <div className="shop-details">
            <h2>{shop.shopName}</h2>
            <p>
              <span>Available Products:</span> {shop.productCount}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
