import { useState, useEffect } from "react";
import styles from "./ManageUser.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageUser() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [username] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Kullanıcının profil resmini almak için useEffect
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('http://localhost:8080/get-picture', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setImage(response.data); // Base64 formatındaki resmi alıyoruz
          setImagePreview(`data:image/jpeg;base64,${response.data}`); // Resim önizlemesi için base64 formatını kullanıyoruz
        }
      } catch (error) {
        console.error('Resim alınırken hata oluştu:', error);
      }
    };

    fetchImage();
  }, [token]);

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords must be same!");
      return;
    }

    if (email.split("@").length < 2) {
      alert("Please enter a valid email.");
      return;
    }

    if (oldPassword === null || oldPassword.length === 0) {
      alert("Please enter your old password.");
      return;
    }

    axios({
      method: 'POST',
      url: 'http://localhost:8080/login',
      data: {
        username: username,
        password: oldPassword
      }
    }).then((res) => {
      if (newPassword.length === 0) {
        axios({
          method: 'PUT',
          url: 'http://localhost:8080/update-email',
          headers: { Authorization: `Bearer ${token}` },
          params: {
            username: username,
            newEmail: email
          }
        }).then(() => {
          localStorage.setItem("email", email);
          location.reload();
        }).catch((err) => alert(err));
      } else {
        axios({
          method: 'PUT',
          url: 'http://localhost:8080/update-user',
          headers: { Authorization: `Bearer ${token}` },
          params: {
            username: username,
            email: email,
            password: newPassword === null ? oldPassword : newPassword
          }
        }).then(() => {
          localStorage.setItem("email", email);
          location.reload();
        }).catch((err) => alert(err));
      }
    }).catch((err) => {
      console.log(err);
      alert("Please enter your old password correctly.")
    });
  };

  const handleDelete = () => {
    axios({
      method: 'DELETE',
      url: 'http://localhost:8080/delete-account',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("rank");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    })
      .catch((err) => alert(err));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Gerçek dosya
    }
  };

  const handleSaveImage = () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("newPicture", image);

    axios.put("http://localhost:8080/update-picture", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }).then(() => {
      alert("Profile picture updated successfully.");
      location.reload();
    }).catch((err) => {
      console.error(err);
      alert("Failed to update profile picture.");
    });
  };

  return (
    <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{username}</h2>
          </div>

          <hr className={styles.line} />

          <div className={styles.formContainer}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.saveButton}>
            <button onClick={handleSave}>Save</button>
          </div>
          <hr className={styles.bottomLine} />
        </div>

        <div className={styles.rightContainer}>
          <div className={styles.imageContainer}>
            {imagePreview ? (
              <img className={styles.profileImage} src={imagePreview} alt="Profile" className={styles.profileImage} />
            ) : (
              <div className={styles.placeholderContainer}>
                <span className={styles.placeholderText}>Upload Image</span>
              </div>
            )}
            <div className={styles.fileInput}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInputButton}
              />
            </div>
          <div className={styles.saveButton}>
            <button className={styles.button} onClick={handleSaveImage}>Save Picture</button>
          </div>
          
          </div>  

          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => {navigate("/address")}}>View Addresses</button>
            <button className={styles.button} onClick={() => {navigate("/current-orders")}}>View Current Orders</button>
            <button className={styles.button} onClick={handleDelete}>Delete Account</button>
          </div>
        </div>
    </div>
  );
}

export default ManageUser;
