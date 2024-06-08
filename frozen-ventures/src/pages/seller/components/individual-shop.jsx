import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../../assets/styles/individual-shop.css";
import { useParams } from "react-router-dom";
import Overlay from "../../../overlay";
import { IndividualProduct } from "../../shop/individual-product";

export const IndividualShop = () => {
  const { shopId, shopName } = useParams();
  const [products, setProducts] = useState([]);
  const individualProductRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showIndividualProduct, setShowIndividualProduct] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost/prosen_bentures/api/getProductsForSellers.php?shopID=${shopId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products");
      }
    };

    fetchProducts();
  }, [shopId]);

  const handleClickOutside = (event) => {
    if (
      individualProductRef.current &&
      !individualProductRef.current.contains(event.target)
    ) {
      setShowIndividualProduct(false);
    }
  };

  const handleProductClick = (productId) => {
    setSelectedId(productId);
    setShowIndividualProduct(true);
    console.log(selectedId);
  };

  const handleCancelClick = () => {
    setSelectedId("");
    setShowIndividualProduct(false);
  };

  return (
    <div className="container individual-shop">
      <Overlay show={showIndividualProduct} />
      {showIndividualProduct && (
        <div ref={individualProductRef}>
          <IndividualProduct
            productId={selectedId}
            cancelClick={handleCancelClick}
          />
        </div>
      )}
      <h1>{shopName}'s Products</h1>

      <div className="product-list">
        {products.length > 0 &&
          products.map((product) => (
            <div
              key={product.productID}
              className="product-item-individual"
              onClick={() => handleProductClick(product.productID)}
            >
              <img
                src={`http://localhost/prosen_bentures/api/productImages/${product.productImage}`}
                alt={product.productName}
              />
              <div className="product-details">
                <p className="product-name">{product.productBrand}</p>
                <p>
                  <span>Product: </span>
                  {product.productName}
                </p>
                <p>
                  <span>Flavor: </span>
                  {product.productFlavor}
                </p>
                <div className="details">
                  <p>
                    <span>Size: </span>
                    {product.productSize}
                  </p>
                  <p className="product-price">Php {product.productPrice}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
