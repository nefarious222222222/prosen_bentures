import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { AddProduct } from "../../../components/add-product";

export const ManageProducts = () => {
  const { user } = useContext(UserContext);
  const accountId = user.accountId;

  const [products, setProducts] = useState([]);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [newProductData, setNewProductData] = useState({
    accountID: accountId,
    productImage: "",
    productName: "",
    productDescription: "",
    status: "1",
  });
  const [imageFile, setImageFile] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost/api/getProducts.php?accountId=${accountId}`)
      .then((response) => {
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error:", error);
        setProducts([]);
      });
  }, [accountId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === img.height) {
          setNewProductData((prevData) => ({
            ...prevData,
            productImage: file.name,
          }));
          setImageFile(file);
          setImagePreview(img.src);
          setErrorMessage("");
        } else {
          setErrorMessage("Please select a square image 1:1 ratio");
        }
      };
    } else {
      setErrorMessage("Please select a valid image file jpg, jpeg, png");
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelAddProduct = () => {
    setNewProductData({
      accountID: accountId,
      productImage: "",
      productName: "",
      productDescription: "",
      status: "1",
    });
    setShowAddProductPopup(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("productImage", imageFile);
    formData.append("productImageName", imageFile.name);
    formData.append("productImageType", imageFile.type);

    axios
      .post("http://localhost/api/uploadImage.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((uploadResponse) => {
        if (uploadResponse.data.status === 1) {
          const imagePath = uploadResponse.data.imagePath;
          setNewProductData((prevData) => ({
            ...prevData,
            productImage: imagePath,
          }));

          axios
            .post("http://localhost/api/addProduct.php", newProductData)
            .then((response) => {
              console.log(response.data);
              if (response.data.status === 1) {
                setSuccessMessage("Product added successfully");
              } else {
                setErrorMessage("Failed to add product");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("An error occurred while adding the product");
            });
        } else {
          setErrorMessage("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while uploading the image");
      });

    setTimeout(() => {
      setNewProductData({
        accountID: accountId,
        productImage: "",
        productName: "",
        productDescription: "",
        status: "1",
      });
      setSuccessMessage("");
      setErrorMessage("");
      setShowAddProductPopup(false);
    }, 2000);
  };

  return (
    <div className="manage-products">
      <div className="header">
        <h1>Manage Products</h1>
        <button onClick={() => setShowAddProductPopup(true)}>
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="products-container">
          {products.map((product) => (
            <div className="product-item" key={product.productID}>
              <div className="product-info">
                <p>
                  <span>Product Id:</span> {product.productID}
                </p>
                <p>
                  <span>Date Added:</span> {product.dateAdded}
                </p>
              </div>

              <div className="product">
                <img
                  src={`http://localhost/api/getProductImage.php?productId=${product.productID}`}
                  alt=""
                />
                <div className="product-text">
                  <div className="info">
                    <p>
                      <span>Product Name:</span> {product.productName}
                    </p>
                  </div>
                  <p className="description">{product.productDescription}</p>
                </div>

                <div className="group-button">
                  <button>Edit</button>
                  <button>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddProductPopup && (
        <AddProduct
          newProductData={newProductData}
          errorMessage={errorMessage}
          successMessage={successMessage}
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
          handleSubmit={handleSubmit}
          handleProductFormChange={handleProductFormChange}
          handleCancelAddProduct={handleCancelAddProduct}
          setShowAddProductPopup={setShowAddProductPopup}
        />
      )}
    </div>
  );
};
