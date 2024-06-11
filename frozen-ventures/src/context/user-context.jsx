import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const accountId = localStorage.getItem("accountId");
    const shopId = localStorage.getItem("shopId");
    const userRole = localStorage.getItem("userRole");
    const shopVerified = localStorage.getItem("shopVerified");
    return accountId ? { accountId, shopId, userRole, shopVerified } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("accountId", user.accountId);
      localStorage.setItem("shopId", user.shopId);
      localStorage.setItem("userRole", user.userRole);
      localStorage.setItem("shopVerified", user.shopVerified);
    } else {
      localStorage.removeItem("accountId");
      localStorage.removeItem("shopId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("shopVerified");
    }
  }, [user]);

  const addUser = (newAccountId, newShopId, newUserRole, newShopVerified) => {
    setUser({ accountId: newAccountId, shopId: newShopId, userRole: newUserRole, shopVerified: newShopVerified });
  };

  const clearUser = () => {
    setUser(null);
  };

  const contextValue = {
    user,
    addUser,
    clearUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};
