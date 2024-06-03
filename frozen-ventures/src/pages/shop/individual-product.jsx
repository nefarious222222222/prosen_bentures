import React, { useState, useEffect } from "react";
import "../../assets/styles/individual-product.css"
import axios from "axios";
import { ArrowRight, Minus, Plus, UserCircle } from "phosphor-react";
import { useParams } from "react-router-dom";

export const IndividualProduct = () => {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/getIndividualProduct.php",
          {
            params: {
              productId: productId,
            },
          }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, []);

  console.log(product)

  return (
    <div className="container individual-product">
      {product ? (
        <div className="product-details">
          <div className="product-header">
            <div className="product-seller">
              <UserCircle size={60} />
              <p>{product.shopName}</p>
            </div>
            <ArrowRight size={50} />
          </div>

          <div className="product">
            <img
              src={`http://localhost/api/productImages/${product.productImage}`}
              alt={product.productName}
            />

            <div className="product-info">
              <div className="info">
                <p className="name">{product.productName}</p>
                <p className="price">Php {product.productPrice}</p>
              </div>

              <div className="info">
                <div className="group">
                  <p>
                    <span>Flavor:</span> {product.productFlavor}
                  </p>
                  <p>
                    <span>Size:</span> {product.productSize}
                  </p>
                  <p>
                    <span>Stocks:</span> {product.productStock}
                  </p>
                </div>

                <div className="quantity-container">
                  <span>Quantity:</span>

                  <div className="quantity">
                    <button>
                      <Minus size={25} />
                    </button>
                    <input type="number" />
                    <button>
                      <Plus size={25} />
                    </button>
                  </div>
                </div>

                <p className="description">{product.productDescription}</p>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button>Add to Cart</button>
            <button>Buy Now</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
