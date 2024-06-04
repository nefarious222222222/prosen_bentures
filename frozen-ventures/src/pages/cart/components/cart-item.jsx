import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context";
import { Minus, Plus, Trash } from "phosphor-react";

export const CartItems = () => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost/api/manageCart.php?accountId=${user.accountId}`
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [user.accountId]);

  return (
    <div className="cart-item">
      <table>
        <tbody>
          {cartItems.map((cartItem) => (
            <tr key={cartItem.productId}>
              <td className="information">
                <img
                  src={`http://localhost/api/productImages/${cartItem.productImage}`}
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
                <button>
                  <Minus size={25} />
                </button>
                <input type="number" value={cartItem.quantity} />
                <button>
                  <Plus size={25} />
                </button>
              </td>
              <td>
                <p>Php {cartItem.totalPrice}</p>
              </td>
              <td className="delete">
                <button>
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
