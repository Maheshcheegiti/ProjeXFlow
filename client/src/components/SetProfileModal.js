import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useEventTrigger } from "./EventTriggerContext";
import { useUserContext } from "./UserContext";

const SetProfileModal = ({ isOpen, onClose, name, image }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = React.createRef();
  const { profileTrigger, setSignInTrigger, setProfileTrigger } =
    useEventTrigger();
  const { userEmail } = useUserContext();

  useEffect(() => {
    setImageUrl(image);
    return () => {
      setSignInTrigger(false);
    };
  }, [setSignInTrigger, image]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Create a URL for the selected image and set it in the state
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setImageUrl(null);
  };

  const handleUpload = () => {
    if (selectedFile && userEmail) {
      // Check that email and selectedFile are not empty
      const formData = new FormData();

      // Extract the file extension from the selected file
      const fileExtension = selectedFile.name.split(".").pop();

      // Set the filename of the uploaded file to be the email address with the appropriate extension
      formData.append(
        "profilePicture",
        selectedFile,
        `${userEmail}.${fileExtension}`
      );
      formData.append("mailid", userEmail); // Use "mailid" consistent with your server-side code

      fetch("http://localhost:5000/setprofilepicture", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast.success("Profile picture uploaded successfully");
            setProfileTrigger(!profileTrigger);
            onClose();
          } else {
            toast.error(data.error);
          }
        })
        .catch((error) => {
          console.error("Upload Error:", error);
          toast.error(
            "Oops! There was an error uploading your profile picture. Please try again later."
          );
        });
    }
  };

  return (
    <Fragment>
      <div className="modal-overlay">
        <div className="modal form-section">
          <h2>Upload Profile Picture</h2>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
          </div>
          {imageUrl ? (
            <div className="profile-picture">
              <img src={imageUrl} alt="Profile" />
            </div>
          ) : (
            <div className="profile-picture">
              <div>{name.charAt(0)}</div>
            </div>
          )}
          <p>
            Welcome, <b>{name}</b>! It's great to have you here. To personalize
            your account, you can upload a profile picture.
          </p>
          {imageUrl && (
            <Fragment>
              <button className="btn" onClick={handleUpload}>
                Upload
              </button>
              <button className="btn" onClick={handleRemovePicture}>
                Remove
              </button>
            </Fragment>
          )}
          <label className="btn">
            Choose
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
          <button className="btn" onClick={onClose}>
            Skip
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default SetProfileModal;
