import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";
import { CheckCircle, NotePencil, X } from "phosphor-react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import ShopImg from "../../../assets/images/1.jpg";

export const SetUpShop = () => {
  const { user } = useContext(UserContext);
  const [newShopData, setNewShopData] = useState({
    accountID: user.accountId,
    shopName: "",
    shopDescription: "",
    shopImage: "",
  });
  const [shop, setShop] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const accountId = user.accountId;
  useEffect(() => {
    const fetchShopInfo = () => {
      axios
        .get(
          `http://localhost/api/setUpShop.php?accountId=${accountId}&status=1`
        )
        .then((response) => {
          const shopData = Array.isArray(response.data) ? response.data[0] : {};
          setShop(shopData);
          setNewShopData({
            accountID: shopData.accountID || user.accountId,
            shopName: shopData.shopName || "",
            shopDescription: shopData.shopDescription || "",
            shopImage: shopData.shopLogo || "",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchShopInfo();
    const intervalId = setInterval(fetchShopInfo, 2500);
    return () => clearInterval(intervalId);
  }, [accountId]);

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleConfirmEditShow = () => {
    setShowConfirmationPopup(true);
  };

  const handleConfirmEditClose = () => {
    setEditable(false);
    setShowConfirmationPopup(false);
  };

  const handleShopFormChange = (e) => {
    const { name, value } = e.target;
    setNewShopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveShop = (e) => {
    e.preventDefault();

    if (newShopData.shopName === "" || newShopData.shopDescription === "") {
      setErrorMessage("Fields cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("shopImage", imageFile);
    formData.append("shopImageName", imageFile.name);
    formData.append("shopImageType", imageFile.type);

    axios
      .post("http://localhost/api/uploadShopLogo.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((uploadResponse) => {
        if (uploadResponse.data.status === 1) {
          const imagePath = uploadResponse.data.imagePath;
          const shopDataToSend = {
            ...newShopData,
            shopImage: imagePath,
          };

          axios
            .post("http://localhost/api/setUpShop.php", shopDataToSend)
            .then((response) => {
              if (response.data.status === 1) {
                setSuccessMessage("Shop information saved successfully");
                setErrorMessage("");
              } else {
                setErrorMessage("Failed to save shop information");
                setSuccessMessage("");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              setErrorMessage("An error occurred while saving the shop information");
              setSuccessMessage("");
            });
        } else {
          setErrorMessage("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred while uploading the image");
      });

    setShowConfirmationPopup(false);
    setEditable(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (img.width === img.height) {
          setNewShopData((prevData) => ({
            ...prevData,
            shopImage: file.name,
          }));
          setImageFile(file);
          setErrorMessage("");
        } else {
          setErrorMessage("Please select a square image 1:1 ratio");
        }
      };
    } else {
      setErrorMessage("Please select a valid image file jpg, jpeg, png");
    }
  };

  return (
    <div className="setup-shop">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <form className="shop-container" onSubmit={handleSaveShop}>
        {showConfirmationPopup && (
          <ConfirmationPopUp
            confirmTitle="Save Shop"
            confirmMessage="Would you like to save your shop information?"
            handleConfirm={handleSaveShop}
            handleCancel={handleConfirmEditClose}
          />
        )}
        <div className="shop-profile">
          <img src={`http://localhost/api/productImages/${shop.shopLogo}` && ShopImg} alt="User" />

          <div className="shop-details">
            <p>{shop.shopName}</p>
            <p>{shop.isVerified ? "Verified" : "Not Verified"}</p>
          </div>
          <button
            type="button"
            onClick={editable ? handleConfirmEditShow : handleEditClick}
          >
            <NotePencil size={30} /> <p>{editable ? "Save" : "Edit"}</p>
          </button>
          {!user.shopId && (
            <button type="button">
              <CheckCircle size={30} /> <p>Verify</p>
            </button>
          )}
          {editable && (
            <button onClick={handleConfirmEditClose}>
              <X size={30} /> <p>Cancel</p>
            </button>
          )}
        </div>
        <div className="shop-info">
          <h2>Shop</h2>
          <div className="field-container">
            <div className="field">
              <label htmlFor="shopImage">Shop Logo:</label>
              <input
                type="file"
                id="shopImage"
                name="shopImage"
                accept=".jpg, .jpeg, .png"
                readOnly={!editable}
                onChange={handleImageChange}
              />
            </div>
            <div className="field">
              <label htmlFor="shopName">Shop Name:</label>
              <input
                name="shopName"
                id="shopName"
                type="text"
                readOnly={!editable}
                value={newShopData.shopName}
                onChange={handleShopFormChange}
              />
            </div>
            <div className="field">
              <label htmlFor="shopDescription">Shop Description:</label>
              <textarea
                name="shopDescription"
                id="shopDescription"
                type="text"
                readOnly={!editable}
                value={newShopData.shopDescription}
                onChange={handleShopFormChange}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};