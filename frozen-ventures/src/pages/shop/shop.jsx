import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/shop.css";
import axios from "axios";
import { UserContext } from "../../context/user-context";
import carrousel from "../../assets/images/0.jpg";
import { Products } from "../../products";
import { useLocation } from "react-router-dom";

export const Shop = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [products, setProducts] = useState([]);

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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/getProductsByRole.php?shopType=${shopType}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [shopType]);

  return (
    <div
      className={`container shop${
        location.pathname === "/home-seller" ? " no-padding" : ""
      }`}
    >
      {location.pathname !== "/home-seller" && (
        <div className="carrousel">
          <img src={carrousel} alt="" />
        </div>
      )}

      <div className="text-container">
        <h2>Check out the shop</h2>
        <p>Find the flavor that suits you</p>
      </div>

      <div className="button-container">
        <button className="filterButton">All</button>
        <button className="filterButton">Peanut</button>
        <button className="filterButton">Chocolate</button>
        <button className="filterButton">Vanilla</button>
        <button className="filterButton">Mancha</button>
        <button className="filterButton">Rocky Road</button>
      </div>

      <div className="products-container">
        <Products products={products} />
      </div>
    </div>
  );
};
