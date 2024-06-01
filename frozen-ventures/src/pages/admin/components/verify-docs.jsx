import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion as m, easeInOut } from "framer-motion";

const PendingUsers = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get("http://localhost/api/getPendingUsers.php");
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await axios.post("http://localhost/api/verifyUser.php", { userId });
      fetchPendingUsers(); // Re-fetch the list after verification
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const filteredUsers = userList.filter(user => {
    return selectedRole === "All" ? true : user.role === selectedRole;
  });

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="verify-docs"
    >
      <h1>Pending Users</h1>

      <div className="button-container">
        <button
          className={selectedRole === "All" ? "active" : ""}
          onClick={() => setSelectedRole("All")}
        >
          All
        </button>
        <button
          className={selectedRole === "Retailer" ? "active" : ""}
          onClick={() => setSelectedRole("Retailer")}
        >
          Retailers
        </button>
        <button
          className={selectedRole === "Distributor" ? "active" : ""}
          onClick={() => setSelectedRole("Distributor")}
        >
          Distributors
        </button>
        <button
          className={selectedRole === "Manufacturer" ? "active" : ""}
          onClick={() => setSelectedRole("Manufacturer")}
        >
          Manufacturers
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Document</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>document here</td>
              <td>
                <button
                  onClick={() => handleVerify(user.id)}
                  disabled={user.status === "verified"}
                >
                  Verify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </m.div>
  );
};

export default PendingUsers;
