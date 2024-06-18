import React, { useState } from "react";
import axios from "axios";
import { SuccessMessage } from "../../../components/success-message";
import { ErrorMessage } from "../../../components/error-message";

export const AddUser = () => {
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [successMessage, setSuccessMessange] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      email: inputEmail,
      userRole: selectedRole,
      password: inputPass,
      confirmPass: inputCPass,
      phone: inputPhone,
    };

    axios
      .post("http://localhost/prosen_bentures/api/manageAdmin.php", newUser)
      .then((response) => {
        if (response.data.status == 1) {
          setSuccessMessange(response.data.message);

          setInputPass("");
          setInputCPass("");
          setInputEmail("");
          setInputPhone("");
          setSelectedRole("");
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        setErrorMessage("Something went wrong");
      });

    setTimeout(() => {
      setSuccessMessange("");
      setErrorMessage("");
    }, 2000);
  };

  return (
    <div className="add-user">
      {successMessage && <SuccessMessage message={successMessage} />}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <h1>Add New User</h1>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="phone">Phone:</label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
          />
        </div>

        <div className="input-container">
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

        <div className="button-group">
          <button
            type="button"
            onClick={() => {
              setInputPass("");
              setInputCPass("");
              setInputEmail("");
              setInputPhone("");
              setSelectedRole("");
              setResponseMessage("");
            }}
          >
            Clear
          </button>
          <button type="submit">Add User</button>
        </div>
      </form>
    </div>
  );
};
