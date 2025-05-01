import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../../modules/navbar/NavBar.jsx";
import "./AdminManageUser.css";

const AdminManageUser = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    /*
    axios.get(`http://localhost:8080/admin/user/${username}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user:", err));
      */
      setUser({
        username: "User12345",
        email: "user12345@example.com",
        registeredAt: "12/05/2022 15:42",
        lastOnline: "23/04/2025 11:15"
      });
  }, [username]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-manage-user">
      <div className="user-container">
        <div className="user-info-section">
          <h1>{user.username}</h1>
          <hr className="user-divider" />
          <input className="email-display" value={user.email} readOnly />

          <div className="button-grid">
            <button>View Addresses</button>
            <button>Delete Account</button>
            <button>View Order History</button>
            <button>Ban Account</button>
            <button>View Reviews</button>
            <button>Restrict Account</button>
            <button>View Reports</button>
            <button>Change Rank</button>
          </div>

          <p>Registered In: {user.registeredAt}</p>
          <p>Last Online: {user.lastOnline}</p>
          <hr className="user-divider" />
        </div>

        <div className="user-image-placeholder">
          {/* Placeholder for profile image */}
        </div>
      </div>
    </div>
  );
};

export default AdminManageUser;
