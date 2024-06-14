import React, { useState, useEffect } from "react";
import axios from "axios";
import { ErrorMessage } from "../../../components/error-message";
import { SuccessMessage } from "../../../components/success-message";
import municipalitiesInBataan from "../../../municipalities";

export const SignUp = () => {
  const [inputPass, setInputPass] = useState("");
  const [inputCPass, setInputCPass] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState({
    street: "",
    barangay: "",
    municipality: "",
    province: "Bataan",
    zipCode: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [barangays, setBarangays] = useState([]);

  const municipalities = municipalitiesInBataan.map((municipality) => ({
    name: municipality.name,
  }));

  useEffect(() => {
    if (selectedMunicipality) {
      const selectedMunicipalityObj = municipalitiesInBataan.find(
        (municipality) => municipality.name === selectedMunicipality
      );
      if (selectedMunicipalityObj) {
        setBarangays(
          selectedMunicipalityObj.barangays.map((barangay) => ({
            name: barangay.name,
            zipCode: barangay.zipCode,
          }))
        );
      }
    }
  }, [selectedMunicipality]);

  useEffect(() => {
    const selectedBarangay = barangays.find(
      (barangay) => barangay.name === address.barangay
    );
    if (selectedBarangay) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        zipCode: selectedBarangay.zipCode,
      }));
    }
  }, [address.barangay, barangays]);

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSigningUp(true);

    const newAccountData = {
      email: inputEmail,
      phone: inputPhone,
      userRole: userRole,
      password: inputPass,
      confirmPass: inputCPass,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      birthdate: birthdate,
      address: address,
    };

    axios
      .post("http://localhost/prosen_bentures/api/signup.php", newAccountData)
      .then((response) => {
        if (response.data.status === 1) {
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 3500);
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Failed to create account");
      });

    setTimeout(() => {
      setIsSigningUp(false);
    }, 2000);
  };

  const minBirthdate = new Date();
  minBirthdate.setFullYear(minBirthdate.getFullYear() - 12);

  const handleChangeBirthdate = (e) => {
    const selectedDate = new Date(e.target.value);
    if (selectedDate <= minBirthdate) {
      setBirthdate(e.target.value);
    } else {
      console.error("User must be at least 12 years old.");
    }
  };

  const handleChangeMunicipality = (e) => {
    setSelectedMunicipality(e.target.value);
    setAddress({
      ...address,
      municipality: e.target.value,
      barangay: "",
    });
  };

  return (
    <div className="sign-up">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-step">
            <div className="input-container">
              <div className="input-field">
                <label htmlFor="userRole">User Role:</label>
                <select
                  id="userRole"
                  name="userRole"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value={null} disabled>
                    Select a role
                  </option>
                  <option value="customer">Customer</option>
                  <option value="retailer">Retailer</option>
                  <option value="distributor">Distributor</option>
                  <option value="manufacturer">Manufacturer</option>
                </select>
              </div>
              <div className="input-field">
                <label htmlFor="emailAdd">Email Address:</label>
                <input
                  type="email"
                  id="emailAdd"
                  name="emailAdd"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
              </div>

              <div className="input-field">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                />
              </div>

              <div className="input-group">
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
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={inputCPass}
                    onChange={(e) => setInputCPass(e.target.value)}
                  />
                </div>
              </div>

              <div className="button-container first-next">
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            <div className="input-container">
              <div className="input-group">
                <div className="input-field">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-field">
                <label htmlFor="gender">Gender:</label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
              <div className="input-field">
                <label htmlFor="birthdate">Birthdate:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={birthdate}
                  onChange={handleChangeBirthdate}
                  max={minBirthdate.toISOString().split("T")[0]}
                />
              </div>
              <div className="button-container">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            <div className="input-container">
              <div className="input-field">
                <label htmlFor="street">Street:</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label htmlFor="municipality">Municipality:</label>
                  <select
                    id="municipality"
                    name="municipality"
                    value={address.municipality}
                    onChange={(e) => handleChangeMunicipality(e)}
                  >
                    <option value="" disabled>
                      Select Municipality
                    </option>
                    {municipalities.map((municipality, index) => (
                      <option key={index} value={municipality.name}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field">
                  <label htmlFor="barangay">Barangay:</label>
                  <select
                    id="barangay"
                    name="barangay"
                    value={address.barangay}
                    onChange={(e) =>
                      setAddress({ ...address, barangay: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Barangay
                    </option>
                    {barangays.map((barangay, index) => (
                      <option key={index} value={barangay.name}>
                        {barangay.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-field">
                  <label htmlFor="province">Province:</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={address.province}
                    readOnly
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="zipCode">Zip Code:</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    readOnly
                  />
                </div>
              </div>

              <div className="button-container">
                <button type="button" onClick={handleBack}>
                  Back
                </button>
                <button type="submit" disabled={isSigningUp}>
                  {isSigningUp ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
