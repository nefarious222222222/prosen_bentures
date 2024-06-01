import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion as m, AnimatePresence, easeInOut } from "framer-motion";

const UserList = () => {
  const [selectRole, setSelectRole] = useState("All");
  const [userList, setUserList] = useState([]);
  const [inputUserId, setInputUserId] = useState("");
  const [idErrors, setIdErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [inputFName, setInputFName] = useState("");
  const [inputLName, setInputLName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [inputBirthdate, setInputBirthdate] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [editErrors, setEditErrors] = useState([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setToday(todayDate);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost/api/getUsers.php");
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmitId = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/api/getUserById.php", { userId: inputUserId });
      const userData = response.data;
      setInputFName(userData.firstName);
      setInputLName(userData.lastName);
      setSelectedRole(userData.role);
      setSelectedGender(userData.gender);
      setInputPhone(userData.phone);
      setInputBirthdate(userData.birthdate);
      setInputEmail(userData.email);
      setShowEditForm(true);
      setSuccessMessage("User data loaded successfully.");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIdErrors(["Failed to fetch user data."]);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    // Add validation and error handling here
    try {
      const response = await axios.post("http://localhost/api/editUser.php", {
        userId: inputUserId,
        firstName: inputFName,
        lastName: inputLName,
        role: selectedRole,
        gender: selectedGender,
        phone: inputPhone,
        birthdate: inputBirthdate,
        email: inputEmail,
        password: inputPass,
      });
      setSuccessMessage("User data updated successfully.");
      setShowEditForm(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user data:", error);
      setEditErrors(["Failed to update user data."]);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="user-list"
    >
      <h1>User List</h1>

      <div className="button-container">
        <button className={selectRole === "All" ? "active" : ""} onClick={() => setSelectRole("All")}>
          All
        </button>
        <button className={selectRole === "Admin" ? "active" : ""} onClick={() => setSelectRole("Admin")}>
          Admin
        </button>
        <button className={selectRole === "Customer" ? "active" : ""} onClick={() => setSelectRole("Customer")}>
          Customers
        </button>
        <button className={selectRole === "Retailer" ? "active" : ""} onClick={() => setSelectRole("Retailer")}>
          Retailers
        </button>
        <button className={selectRole === "Distributor" ? "active" : ""} onClick={() => setSelectRole("Distributor")}>
          Distributors
        </button>
        <button className={selectRole === "Manufacturer" ? "active" : ""} onClick={() => setSelectRole("Manufacturer")}>
          Manufacturers
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birthdate</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.id}</p>
              </td>
              <td>
                <p>{user.firstName}</p>
              </td>
              <td>
                <p>{user.lastName}</p>
              </td>
              <td>
                <p>{user.birthdate}</p>
              </td>
              <td>
                <p>{user.gender}</p>
              </td>
              <td>
                <p>{user.email}</p>
              </td>
              <td>
                <p>{user.phone}</p>
              </td>
              <td>
                <p>{user.role}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="edit-user">
        <h1>Edit User</h1>
        <form className="header" onSubmit={handleSubmitId}>
          <AnimatePresence>
            {idErrors.length > 0 && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="error-container"
              >
                {idErrors.map((error, index) => (
                  <div key={index} className="alert-error">
                    <p>{error}</p>
                  </div>
                ))}
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {successMessage && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="success-container"
              >
                <p>{successMessage}</p>
              </m.div>
            )}
          </AnimatePresence>
          <div className="ib-container">
            <div className="input-field">
              <label htmlFor="userId">Edit User:</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
              />
            </div>

            <button type="submit">Edit</button>
          </div>
        </form>

        <AnimatePresence>
          {showEditForm && (
            <m.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: easeInOut }}
              className="edit-form"
              onSubmit={handleSubmitEdit}
            >
              <AnimatePresence>
                {editErrors.length > 0 && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeInOut }}
                    className="error-container"
                  >
                    {editErrors.map((error, index) => (
                      <div key={index} className="alert-error">
                        <p>{error}</p>
                      </div>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {successMessage && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: easeInOut }}
                    className="success-container"
                  >
                    <p>{successMessage}</p>
                  </m.div>
                )}
              </AnimatePresence>
              <div className="input-container">
                <div className="input-field">
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    name="Role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Manufacturer">Manufacturer</option>
                  </select>
                </div>

                <div className="input-field">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={inputFName}
                    onChange={(e) => setInputFName(e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={inputLName}
                    onChange={(e) => setInputLName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="input-field gender">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="RatherNotSay">Rather not say</option>
                  </select>
                </div>

                <div className="input-field">
                  <label htmlFor="phoneNum">Phone Number:</label>
                  <input
                    type="number"
                    id="phoneNum"
                    name="phoneNum"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="birthdate">Birthdate:</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={inputBirthdate}
                    onChange={(e) => setInputBirthdate(e.target.value)}
                    max={today}
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="input-field">
                  <label htmlFor="emailAdd">Email Address:</label>
                  <input
                    type="text"
                    id="emailAdd"
                    name="emailAdd"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={inputPass}
                    onChange={(e) => setInputPass(e.target.value)}
                  />
                </div>

                <div className="input-field">
                  <label htmlFor="confirmPass">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPass"
                    name="confirmPass"
                    value={inputCPass}
                    onChange={(e) => setInputCPass(e.target.value)}
                  />
                </div>
              </div>

              <div className="submit-btn">
                <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </m.form>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  );
};

export default UserList;
