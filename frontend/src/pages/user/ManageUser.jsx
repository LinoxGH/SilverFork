import { useState } from "react";
import styles from "./ManageUser.module.css";

function NavBar() {
  return <div className={styles.navbar}></div>;
}

function ManageUser() {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const handleSave = () => {
    console.log("Saved:", { email, newPassword, confirmPassword, oldPassword });
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
    }
  };
  return (
    <div className={styles.container}>
      <NavBar/>
      <h2 className={styles.title}>User12345</h2>
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt="Profile" className={styles.profileImage} />
        ) : (
          <span className={styles.placeholderText}>Upload Image</span>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
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
      
      <button className={styles.saveButton} onClick={handleSave}>Save</button>
      <hr className={styles.bottomLine} />
      <div className={styles.buttonGroup}>
        <button className={styles.button}>View Addresses</button>
        <button className={styles.button}>View Order History</button>
        <button className={styles.button}>Delete Account</button>
      </div>
    </div>
  );
}

export default ManageUser;
