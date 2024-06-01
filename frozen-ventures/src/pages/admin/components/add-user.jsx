import React, { useState } from "react";

import { motion as m, easeInOut } from "framer-motion";



  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="add-user"
    >
      <h1>Add New User</h1>

      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <div key={index} className="alert-error">
                <p>{error}</p>
              </div>
            ))}
          </div>
        )}
        {successMessage && (
          <div className="success-container">
            <p>{successMessage}</p>
          </div>
        )}
        <div className="input-container">
          <div className="input-field">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="Role"
              value={selectedRole}
              onChange={handleRoleChange}
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
              onChange={handleGenderChange}
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

        {(selectedRole === "Retailer" ||
          selectedRole === "Distributor" ||
          selectedRole === "Manufacturer") && (
          <div className="input-field image-upload">
            <label htmlFor="imageUpload">Choose Image:</label>
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
            />
          </div>
        )}

        <div className="submit-btn">
          <button type="submit">Submit</button>
        </div>
      </form>
    </m.div>
  );
};
