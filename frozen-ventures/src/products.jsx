import React, { useState, useEffect, useRef } from "react";
import "./assets/styles/products.css";
import { IndividualProduct } from "./pages/shop/individual-product";
import { useLocation } from "react-router-dom";
import Overlay from "./overlay";
import { Star } from "phosphor-react";

export const Products = ({ products }) => {
  const [selectedId, setSelectedId] = useState("");
  const individualProductRef = useRef(null);
  const [showIndividualProduct, setShowIndividualProduct] = useState(false);
  const location = useLocation();

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
  };

  const displayedProducts = products
    ? location.pathname === "/"
      ? products.slice(0, 4)
      : products
    : [];

  return (
    <>
      <Overlay show={showIndividualProduct} />
      {showIndividualProduct && (
        <div ref={individualProductRef}>
          <IndividualProduct
            productId={selectedId}
            cancelClick={handleCancelClick}
          />
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
              <span>Brand: </span>
              {product.productBrand}
            </p>
            <p>
              <span>Flavor: </span>
              {product.productFlavor}
            </p>
            <p>
              <span>Shop: </span>
              {product.shopName}
            </p>
            <div className="details">
              <div className="rating">
                <Star size={35} />
                <p>
                  (
                  {product.averageRating
                    ? product.averageRating
                    : "0.00"}
                  /5)
                </p>
              </div>
              <p className="product-price">Php {product.productPrice}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
