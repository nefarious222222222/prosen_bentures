import React, { useContext, useState, useEffect, useRef } from "react";
import "./assets/styles/products.css";
import axios from "axios";
import { UserContext } from "./context/user-context";
import { IndividualProduct } from "./pages/shop/individual-product";
import { useLocation } from "react-router-dom";
import { Overlay } from "./overlay";

export const Products = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const individualProductRef = useRef(null);
  const [showIndividualProduct, setShowIndividualProduct] = useState(false);
  const location = useLocation();

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

  const handleClickOutside = (event) => {
    if (
      individualProductRef.current &&
      !individualProductRef.current.contains(event.target)
    ) {
      setShowIndividualProduct(false);
    }
  };

  useEffect(() => {
    if (showIndividualProduct) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showIndividualProduct]);

  const handleProductClick = (productId) => {
    setSelectedId(productId);
    setShowIndividualProduct(true);
    console.log(selectedId);
  };

  const handleCancelClick = () => {
    setSelectedId("");
    setShowIndividualProduct(false);
  }

  const displayedProducts =
    location.pathname === "/" ? products.slice(0, 4) : products;

  return (
    <>
      <Overlay show={showIndividualProduct} />
      {showIndividualProduct && (
        <div ref={individualProductRef}>
          <IndividualProduct productId={selectedId} cancelClick={handleCancelClick} />
        </div>
      )}
      {displayedProducts.map((product) => (
        <div
          className="product-item-individual"
          key={product.productID}
          onClick={() => handleProductClick(product.productID)}
        >
          <img
            src={`http://localhost/prosen_bentures/api/productImages/${product.productImage}`}
            alt={product.productName}
          />
          <div className="product-details">
            <p className="product-name">{product.productName}</p>
            <p>
              <span>Flavor: </span>
              {product.productFlavor}
            </p>
            <p>
              <span>Shop: </span>
              {product.shopName}
            </p>
            <div className="details">
              <p>{product.productSize}</p>
              <p>Php {product.productPrice}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};