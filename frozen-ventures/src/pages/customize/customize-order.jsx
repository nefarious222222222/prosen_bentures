import React, { useState } from "react";
import "../../assets/styles/customize.css";
import ImageOne from "../../assets/images/1.jpg";

export const CustomizeOrder = () => {
  const [numFlavors, setNumFlavors] = useState(0);
  const [numAddOns, setNumAddOns] = useState(0);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const itemPrices = {
    Matcha: 20.0,
    Chocolate: 15.0,
    Vanilla: 15.0,
    "Rocky Road": 18.0,
    Strawberry: 16.0,
    "1 liter": 50.0,
    "2 liters": 80.0,
    "3 liters": 110.0,
    "4 liters": 140.0,
    Marshmallow: 5.0,
    Sprinkles: 3.0,
    "Caramel Sauce": 7.0,
    Nuts: 8.0,
    "Whipped Cream": 5.0,
    "Cookie Dough": 10.0,
  };

  const handleNumFlavorsChange = (e) => {
    setNumFlavors(parseInt(e.target.value));
  };

  const handleNumAddOnsChange = (e) => {
    setNumAddOns(parseInt(e.target.value));
  };

  const handleFlavorChange = (e, index) => {
    const newSelectedFlavors = [...selectedFlavors];
    newSelectedFlavors[index] = e.target.value;
    setSelectedFlavors(newSelectedFlavors);
    calculateTotalPrice();
  };

  const handleAddOnChange = (e, index) => {
    const newSelectedAddOns = [...selectedAddOns];
    newSelectedAddOns[index] = e.target.value;
    setSelectedAddOns(newSelectedAddOns);
    calculateTotalPrice();
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
    calculateTotalPrice();
  };

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    selectedFlavors.forEach((flavor) => {
      totalPrice += itemPrices[flavor];
    });

    selectedAddOns.forEach((addon) => {
      totalPrice += itemPrices[addon];
    });

    totalPrice += itemPrices[selectedSize];

    setTotalPrice(totalPrice);
  };

  return (
    <div className="container customize-order">
      <h1>Customize Your Order</h1>

      <div className="custom-order-container">
        <div className="custom-selection">
          <h2>Venture and Customize</h2>

          <div className="input-field">
            <label htmlFor="">Shop Name:</label>
            <select name="" id="" onChange={handleShopChange}>
              <option value="">select a shop</option>
              <option value="Shop 1">Shop 1</option>
              <option value="Shop 2">Shop 2</option>
              <option value="Shop 3">Shop 3</option>
              <option value="Shop 4">Shop 4</option>
            </select>
          </div>

          <div className="selection">
            <div className="input-field">
              <label htmlFor="">Number Of Flavors:</label>
              <select name="" id="" onChange={handleNumFlavorsChange}>
                <option value="">select number of flavors</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="number-section">
              {[...Array(numFlavors)].map((_, index) => (
                <div className="input-field" key={index}>
                  <label htmlFor={`flavor-${index + 1}`}>
                    Flavor {index + 1}:
                  </label>
                  <select
                    name={`flavor-${index + 1}`}
                    id={`flavor-${index + 1}`}
                    onChange={(e) => handleFlavorChange(e, index)}
                  >
                    <option value="">select flavor</option>
                    <option value="Matcha">Matcha</option>
                    <option value="Chocolate">Chocolate</option>
                    <option value="Vanilla">Vanilla</option>
                    <option value="Rocky Road">Rocky Road</option>
                    <option value="Strawberry">Strawberry</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="">Size:</label>
            <select name="" id="" onChange={handleSizeChange}>
              <option value="">select size</option>
              <option value="1 liter">1 liter</option>
              <option value="2 liters">2 liters</option>
              <option value="3 liters">3 liters</option>
              <option value="4 liters">4 liters</option>
            </select>
          </div>

          <div className="selection">
            <div className="input-field">
              <label htmlFor="">Number Of Add-Ons:</label>
              <select name="" id="" onChange={handleNumAddOnsChange}>
                <option value="">select number of add-ons</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div className="number-section">
              {[...Array(numAddOns)].map((_, index) => (
                <div className="input-field" key={index}>
                  <label htmlFor={`addon-${index + 1}`}>
                    Add-On {index + 1}:
                  </label>
                  <select
                    name={`addon-${index + 1}`}
                    id={`addon-${index + 1}`}
                    onChange={(e) => handleAddOnChange(e, index)}
                  >
                    <option value="">select add-on</option>
                    <option value="Marshmallow">Marshmallow</option>
                    <option value="Sprinkles">Sprinkles</option>
                    <option value="Caramel Sauce">Caramel Sauce</option>
                    <option value="Nuts">Nuts</option>
                    <option value="Whipped Cream">Whipped Cream</option>
                    <option value="Cookie Dough">Cookie Dough</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="custom-product">
          <h2>Custom Details</h2>
          <div className="custom-details">
            <div className="details">
              <span>Shop Name: </span>
              <p>{selectedShop}</p>
            </div>

            {[...Array(numFlavors)].map((_, index) => (
              <div className="details" key={index}>
                <span>Flavor {index + 1}: </span>
                <p>{selectedFlavors[index]}</p>
              </div>
            ))}

            <div className="details">
              <span>Size: </span>
              <p>{selectedSize}</p>
            </div>

            {[...Array(numAddOns)].map((_, index) => (
              <div className="details" key={index}>
                <span>Add-On {index + 1}: </span>
                <p>{selectedAddOns[index]}</p>
              </div>
            ))}

            <div className="details">
              <span>Total Price: </span>
              <p>{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="button-group">
            <button>Cancel</button>
            <button>Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};
