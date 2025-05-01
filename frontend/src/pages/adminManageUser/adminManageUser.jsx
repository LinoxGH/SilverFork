import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../modules/navbar/NavBar.jsx";
import "./AdminManageUser.css";

const AdminManageUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`http://localhost:8080/admin/users/${username}`, { headers })
      .then(res => setUser(res.data))
      .catch(err => console.error("Failed to fetch user:", err));
  }, [username]);

  const deleteUser = () => {
    axios.delete(`http://localhost:8080/admin/users/delete/${username}`, { headers })
      .then(() => {
        alert("User deleted.");
        navigate("/admin-dashboard");
      })
      .catch(err => alert("Delete failed"));
  };

  const updateStatus = (status) => {
    axios.put(`http://localhost:8080/admin/users/${username}/status`, null, {
      headers,
      params: { status }
    })
    .then(() => alert(`Status changed to ${status}`))
    .catch(err => alert("Failed to change status"));
  };

  const changeRank = () => {
    const newRank = prompt("Enter new rank:");
    if (!newRank) return;
    axios.put(`http://localhost:8080/admin/users/${username}/rank`, null, {
      headers,
      params: { rank: newRank }
    })
    .then(() => alert("Rank updated"))
    .catch(err => alert("Failed to update rank"));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-manage-user"> 
      <NavBar />
      <div className="user-container">
        <div className="user-info-section">
          <h1>{user.username}</h1>
          <hr className="user-divider" />
          <input className="email-display" value={user.email} readOnly />

          <div className="button-grid">
            <button>View Addresses</button>
            <button onClick={deleteUser}>Delete Account</button>
            <button>View Order History</button>
            <button onClick={() => updateStatus("BANNED")}>Ban Account</button>
            <button>View Reviews</button>
            <button onClick={() => updateStatus("RESTRICTED")}>Restrict Account</button>
            <button>View Reports</button>
            <button onClick={changeRank}>Change Rank</button>
          </div>

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
