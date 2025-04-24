import { useState } from "react";
import NavBar from "../../modules/navbar/NavBar.jsx";
import styles from "./ManageUser.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function ManageUser() {
  const [image, setImage] = useState(null);
  const [username] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
      // Old Password is correct, can submit changes to backend.
      if (newPassword.length === 0) {
        // Only Change Email
        axios({
          method: 'PUT',
          url: 'http://localhost:8080/update-email',
          headers: { Authorization: `Bearer ${token}` },
          params: {
            username: username,
            newEmail: email
          }
        }).then((res) => {
          // User updated successfully, update local storage.
          localStorage.setItem("email", email);
          navigate("/manage-user");
        }).catch((err) => alert(err));
      } else {
        // Change Email and Password
        axios({
          method: 'PUT',
          url: 'http://localhost:8080/update-user',
          headers: { Authorization: `Bearer ${token}` },
          params: {
            username: username,
            email: email,
            password: newPassword === null ? oldPassword : newPassword
          }
        }).then((res) => {
          // User updated successfully, update local storage.
          localStorage.setItem("email", email);
          navigate("/manage-user");
        }).catch((err) => alert(err));
      }
    })
      // Incorrect password.
      .catch((err) => {
      console.log(err);
      alert("Please enter your old password correctly.")
    })


  };

  const handleDelete = () => {
    axios({
      method: 'DELETE',
      url: 'http://localhost:8080/delete-account',
      headers: { Authorization: `Bearer ${token}`}
    }).then((res) => navigate("/"))
      .catch((err) => alert(err));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
    }
  };
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.parentImageContainer}>
        <div className={styles.profileLogin}>
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
            className={styles.input}/></div>

          <div className={styles.saveButton}>        
            <button  onClick={handleSave}>Save</button>
          </div>
          <hr className={styles.bottomLine} />
        </div>
          <div className={styles.profileRightContainer}>
              <div className={styles.imageContainer}>
                {image ? (
                  <img src={image} alt="Profile" className={styles.profileImage} />
                ) : (
                  <div className={styles.placeholderContainer}>
                    <span className={styles.placeholderText}>Upload Image</span>
                    </div>
                  
                )}
                <div className={styles.fileInput}>
                  <input type="file" accept="image/*" onClick={handleImageChange}  className={styles.fileInputButton}/>
                </div>
                
              </div>

              <div className={styles.buttonGroup}>
              <button className={styles.button}>View Addresses</button>
              <button className={styles.button}>View Order History</button>
              <button className={styles.button} onClick={handleDelete}>Delete Account</button>
              </div>
          </div>
        </div>  
    </div>
  );
}

export default ManageUser;
