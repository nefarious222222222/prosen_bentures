import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/styles/individual-shop.css";
import { useParams } from "react-router-dom";

export const IndividualShop = () => {
  const { shopId, shopName } = useParams();
  const [products, setProducts] = useState([]);

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

  console.log(products);

  return (
    <div className="container individual-shop">
      <h1>{shopName}'s Products</h1>
      <div className="product-list">
        {products.length > 0 &&
          products.map((product) => (
            <div key={product.productID} className="product-card">
              <h3>{product.productName}</h3>
              <img
                src={`http://localhost/prosen_bentures/api/productImages/${product.productImage}`}
                alt={product.productName}
              />
              <p>{product.productDescription}</p>
              <p>Price: Php {product.productPrice}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
