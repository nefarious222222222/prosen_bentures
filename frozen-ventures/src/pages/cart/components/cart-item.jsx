import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/user-context";
import { Minus, Plus, Trash } from "phosphor-react";

export const CartItems = ({
  cartItems,
  handleQuantityChange,
  updateSubTotal,
  handleDeleteClick,
}) => {
  useEffect(() => {
    const subTotal = cartItems.reduce(
      (acc, item) => acc + item.productPrice * item.quantity,
      0
    );
    updateSubTotal(subTotal);
  }, [cartItems, updateSubTotal]);

  return (
    <div className="cart-item">
      <table>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr className="cart-product" key={cartItem.cartID}>
              <td className="information">
                <img
                  src={`http://localhost/prosen_bentures/api/productImages/${cartItem.productImage}`}
                  alt={cartItem.productName}
                />
                <div className="description">
                  <p>{cartItem.productName}</p>
                  <p>{cartItem.productFlavor}</p>
                  <p>{cartItem.shopName}</p>
                  <p>{cartItem.productSize}</p>
                  <p>Php {cartItem.productPrice}</p>
                  <p>Stocks: {cartItem.productStock}</p>
                </div>
              </td>
              <td className="quantity">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.quantity - 1,
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                  disabled={cartItem.quantity <= 1}
                >
                  <Minus size={25} />
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      parseInt(e.target.value),
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.quantity + 1,
                      cartItem.productPrice,
                      cartItem.productStock
                    )
                  }
                  disabled={cartItem.quantity >= cartItem.productStock}
                >
                  <Plus size={25} />
                </button>
              </td>
              <td>
                <p>Php {cartItem.totalPrice}</p>
              </td>
              <td className="delete">
                <button
                  onClick={() =>
                    handleDeleteClick(
                      cartItem.productID,
                      cartItem.priceID,
                      cartItem.productName
                    )
                  }
                >
                  <Trash size={45} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
