import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../../../context/user-context.jsx";
import { ConfirmationPopUp } from "../../../components/confirmation-popup";
import { ErrorMessage } from "../../../components/error-message.jsx";
import { SuccessMessage } from "../../../components/success-message.jsx";
import { NotePencil, UserCircle, X } from "phosphor-react";
import municipalitiesInBataan from "../../../municipalities";

export const Profile = () => {
  const { user } = useContext(UserContext);
  const [initialState, setInitialState] = useState({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userRole, setUserRole] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputBirthdate, setInputBirthdate] = useState("");
  const [inputGender, setInputGender] = useState("");
  const [inputStreet, setInputStreet] = useState("");
  const [inputBarangay, setInputBarangay] = useState("");
  const [inputMunicipality, setInputMunicipality] = useState("");
  const [inputProvince, setInputProvince] = useState("");
  const [inputZip, setInputZip] = useState("");
  const [editable, setEditable] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [barangays, setBarangays] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const municipalities = municipalitiesInBataan.map((municipality) => ({
    name: municipality.name,
  }));

  useEffect(() => {
    axios
      .get(
        `http://localhost/prosen_bentures/api/managePersonalInfo.php?accountId=${user.accountId}`
      )
      .then((response) => {
        const userData = response.data;
        setInitialState({
          profileImage: userData.profileImage,
          email: userData.email,
          phone: userData.phone,
          userRole: userData.userRole,
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthdate: userData.birthdate,
          gender: userData.gender,
          street: userData.street,
          barangay: userData.barangay,
          municipality: userData.municipality,
          province: userData.province,
          zip: userData.zip,
        });
        setProfileImagePreview(userData.profileImage);
        setEmail(userData.email);
        setPhone(userData.phone);
        setUserRole(userData.userRole);
        setInputFirstName(userData.firstName);
        setInputLastName(userData.lastName);
        setInputBirthdate(userData.birthdate);
        setInputGender(userData.gender);
        setInputStreet(userData.street);
        setInputBarangay(userData.barangay);
        setInputMunicipality(userData.municipality);
        setInputProvince(userData.province);
        setInputZip(userData.zip);

        setSelectedMunicipality(userData.municipality);

        if (response.data.status === 0) {
          setErrorMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Failed to load information");
      });

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }, [user.accountId]);

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
      (barangay) => barangay.name === inputBarangay
    );
    if (selectedBarangay) {
      setInputZip(selectedBarangay.zipCode);
    }
  }, [inputBarangay, barangays]);

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleConfirmEditShow = () => {
    setShowConfirmationPopup(true);
  };
  
  const handleConfirmEditClose = () => {
    setEditable(false);
    setShowConfirmationPopup(false);
    setProfileImagePreview(initialState.profileImage);
    setEmail(initialState.email);
    setPhone(initialState.phone);
    setUserRole(initialState.userRole);
    setInputFirstName(initialState.firstName);
    setInputLastName(initialState.lastName);
    setInputBirthdate(initialState.birthdate);
    setInputGender(initialState.gender);
    setInputStreet(initialState.street);
    setInputBarangay(initialState.barangay);
    setInputMunicipality(initialState.municipality);
    setInputProvince(initialState.province);
    setInputZip(initialState.zip);
    setSelectedMunicipality(initialState.municipality);

    if (initialState.municipality) {
      const selectedMunicipalityObj = municipalitiesInBataan.find(
        (municipality) => municipality.name === initialState.municipality
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
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const handleSaveEdit = () => {
    handleSubmit(new Event("submit", { cancelable: true }));
    setShowConfirmationPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profileImage) {
      setErrorMessage("Please select an image");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", profileImage);
    formData.append("profileImageName", profileImage.name);
    formData.append("profileImageType", profileImage.type);

    axios
      .post(
        "http://localhost/prosen_bentures/api/uploadProfileImage.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((uploadResponse) => {
        if (uploadResponse.data.status === 1) {
          const imagePath = uploadResponse.data.imagePath;
          const newPersonalData = {
            accountId: user.accountId,
            firstName: inputFirstName,
            lastName: inputLastName,
            birthdate: inputBirthdate,
            gender: inputGender,
            street: inputStreet,
            barangay: inputBarangay,
            municipality: inputMunicipality,
            province: inputProvince,
            zip: inputZip,
            profileImage: profileImage.name,
          };

          axios
            .post(
              "http://localhost/prosen_bentures/api/managePersonalInfo.php",
              newPersonalData
            )
            .then((response) => {
              console.log("Response:", response.data);
              if (response.data.status === 1) {
                setSuccessMessage(response.data.message);
              } else {
                setErrorMessage(response.data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              setErrorMessage("Failed to update information");
            });
        } else {
          setErrorMessage("Failed to upload image");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred while uploading the image");
      });

    setEditable(false);
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 3000);
  };

  const handleChangeMunicipality = (e) => {
    setSelectedMunicipality(e.target.value);
    setInputMunicipality(e.target.value);
    setInputBarangay("");
    setInputZip("");
  };

  const handleChangeBarangay = (e) => {
    setInputBarangay(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleProfileImageClick = () => {
    document.getElementById("profileImageInput").click();
  };

  return (
    <div className="profile">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <form className="user" onSubmit={handleSubmit}>
        {showConfirmationPopup && (
          <ConfirmationPopUp
            confirmTitle="Save"
            confirmMessage="Would you like to save your information?"
            handleConfirm={handleSaveEdit}
            handleCancel={handleConfirmEditClose}
          />
        )}
        <div className="user-profile">
          {profileImagePreview ? (
            <img
              src={`http://localhost/prosen_bentures/api/profileImages/${profileImagePreview}`}
              alt="Profile"
              className="profile-image"
              onClick={handleProfileImageClick}
            />
          ) : (
            <UserCircle size={300} onClick={handleProfileImageClick} />
          )}
          <input
            type="file"
            id="profileImageInput"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            disabled={!editable}
            onChange={handleImageChange}
          />
          <div className="account-info">
            <p>{email ? email : "No email"}</p>
            <p>{phone ? phone : "No phone number"}</p>
            <p>{userRole ? userRole : "No role"}</p>
          </div>
          <button
            type="button"
            onClick={editable ? handleConfirmEditShow : handleEditClick}
          >
            <NotePencil size={30} /> <p>{editable ? "Save" : "Edit"}</p>
          </button>
          {editable && (
            <button onClick={handleConfirmEditClose}>
              <X size={30} /> <p>Cancel</p>
            </button>
          )}
        </div>
        <div className="user-info">
          <h2>User Information</h2>
          <div className="info">
            <div className="field-container">
              <div className="field">
                <label htmlFor="firstName">First Name:</label>
                <input
                  name="firstName"
                  id="firstName"
                  type="text"
                  readOnly={!editable}
                  value={inputFirstName}
                  onChange={(e) => setInputFirstName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  name="lastName"
                  id="lastName"
                  type="text"
                  readOnly={!editable}
                  value={inputLastName}
                  onChange={(e) => setInputLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="birthdate">Birthdate:</label>
                <input
                  name="birthdate"
                  id="birthdate"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  readOnly={!editable}
                  value={inputBirthdate}
                  onChange={(e) => setInputBirthdate(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="gender">Gender:</label>
                <select
                  name="gender"
                  id="gender"
                  disabled={!editable}
                  value={inputGender}
                  onChange={(e) => setInputGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
          </div>
          <h2>Address</h2>
          <div className="info">
            <div className="field-container">
              <div className="field">
                <label htmlFor="street">Street:</label>
                <input
                  name="street"
                  id="street"
                  type="text"
                  readOnly={!editable}
                  value={inputStreet}
                  onChange={(e) => setInputStreet(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="barangay">Barangay:</label>
                <select
                  name="barangay"
                  id="barangay"
                  disabled={!editable}
                  value={inputBarangay}
                  onChange={handleChangeBarangay}
                >
                  <option value="">Select Barangay</option>
                  {barangays.map((barangay) => (
                    <option key={barangay.name} value={barangay.name}>
                      {barangay.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="municipality">Municipality:</label>
                <select
                  name="municipality"
                  id="municipality"
                  disabled={!editable}
                  value={inputMunicipality}
                  onChange={handleChangeMunicipality}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((municipality) => (
                    <option key={municipality.name} value={municipality.name}>
                      {municipality.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="province">Province:</label>
                <input
                  name="province"
                  id="province"
                  type="text"
                  readOnly={!editable}
                  value={inputProvince}
                  onChange={(e) => setInputProvince(e.target.value)}
                />
              </div>
            </div>
            <div className="field-container">
              <div className="field">
                <label htmlFor="zip">ZIP Code:</label>
                <input
                  name="zip"
                  id="zip"
                  type="text"
                  readOnly={!editable}
                  value={inputZip}
                  onChange={(e) => setInputZip(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </div>
  );
};
