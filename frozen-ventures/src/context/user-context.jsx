import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const accountId = localStorage.getItem("accountId");
    const userRole = localStorage.getItem("userRole");
    return accountId ? { accountId, userRole } : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("accountId", user.accountId);
      localStorage.setItem("userRole", user.userRole);
    } else {
      localStorage.removeItem("accountId");
      localStorage.removeItem("userRole");
    }
  }, [user]);

  const addUser = (newAccountId, newUserRole) => {
    setUser({ accountId: newAccountId, userRole: newUserRole });
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
