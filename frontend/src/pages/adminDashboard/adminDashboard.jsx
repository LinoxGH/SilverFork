import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    solved: 0,
    ongoing: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Replace with real API endpoints
    axios.get("http://localhost:8080/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setAccounts(res.data))
    .catch(err => console.error("Failed to fetch accounts:", err));
    

    /*
    axios.get("http://localhost:8080/admin/report-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch stats:", err));
    */
    
  }, []);


  //might need fixing
  const filteredAccounts = accounts.filter(acc =>
    acc.username.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-body">
        <div className="left-panel">
          <input
            className="account-search"
            type="text"
            placeholder="Search for Account"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="account-grid">
            {filteredAccounts.map((acc) => (
              <div
                key={acc.id}
                className="account-card"
                onClick={() => navigate(`/admin-dashboard/${encodeURIComponent(acc.username)}`)}
              >
                <div className="account-image">Account Image</div>
                <div className="account-info">
                  <p><strong>{acc.username}</strong></p>
                  <p>{acc.email}</p>
                  <p>{acc.rank}</p>
                  <p>{acc.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-panel">
          <div className="stats">
            <p>Pending Reports Count: {stats.pending}</p>
            <p>Solved Reports Count: {stats.solved}</p>
            <p>Ongoing Orders: {stats.ongoing}</p>
          </div>
          <hr />
          <button className="view-reports">View Reports</button>
          <div className="chart-placeholder">New Reports</div>
          <div className="chart-placeholder">Resolved Reports</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
