import React, { useContext, useState, useEffect } from "react";
import "../../assets/styles/product.css";
import { UserContext } from "../../context/user-context";
import { Link } from "react-router-dom";
import { fetchProductsBasedOnUserRole } from "../../firebase/firebase-products";

export const Products = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.userRole;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const databaseProducts = await fetchProductsBasedOnUserRole(userRole);
        const formattedProducts = databaseProducts.map((product) => ({
          productId: product.productId,
          productName: product.productName,
          productPrice: product.productPrice,
          shopName: product.shopName,
          productImage: product.productImage,
          productDescription: product.productDescription,
          productSize: product.productSize,
          productStock: product.productStock,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [userRole]);
  
  return (
    <div className="product-container">
      {products.map((product) => (
        <Link
          to={`/individual-product/${product.productId}`}
          key={product.productId}
          style={{ textDecoration: "none" }}
        >
          <div className="product-card">
            <img src={product.productImage} alt={product.productName} />
            <div className="product-box">
              <div className="product-info">
                <div className="info-group">
                  <p className="name">{product.productName}</p>
                  <p>{product.shopName}</p>
                </div>
                <div className="info-group">
                  <p className="price">Php {product.productPrice}</p>
                  <p>{product.productSize}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
