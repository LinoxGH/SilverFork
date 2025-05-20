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

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery");

  const sampleReports = {
    delivery: [
      {
        id: 101,
        description: "Late delivery",
        user: "userA",
        delivery: "Order #1234"
      },
      {
        id: 102,
        description: "Wrong address",
        user: "userB",
        delivery: "Order #5678"
      },
    ],
    review: [
      {
        id: 201,
        description: "Offensive language",
        user: "userC",
        review: "Review #9981"
      },
      {
        id: 202,
        description: "Spam review",
        user: "userD",
        review: "Review #8844"
      },
    ],
  };

  const handleMarkSolved = (id) => {
    console.log("Mark solved:", id);
  };

  const handleAction = (id, type) => {
    console.log(type === "delivery" ? "Cancel delivery:" : "Remove review:", id);
  };


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
          <button className="view-reports" onClick={() => setShowModal(true)}>View Reports</button>
          <div className="chart-placeholder">New Reports</div>
          <div className="chart-placeholder">Resolved Reports</div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content wide">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="tab-bar">
                <button onClick={() => setActiveTab("delivery")} className={`tab-button ${activeTab === "delivery" ? "active" : ""}`}>Delivery Reports</button>
                <button onClick={() => setActiveTab("review")} className={`tab-button ${activeTab === "review" ? "active" : ""}`}>Review Reports</button>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>✖</button>
            </div>

            <div className="order-list">
              {(sampleReports[activeTab]).map((report) => (
                <div key={report.id} className="order-card">
                  <p><strong>ID:</strong> {report.id}</p>
                  <p><strong>Description:</strong> {report.description}</p>
                  <p><strong>
                    {activeTab === "review" ? "Reporting Restaurant:" : "Reporting User:"}
                  </strong> {report.user}</p>
                  <p>
                    <strong>
                      {activeTab === "delivery" ? "Reported Delivery:" : "Reported Review:"}
                    </strong> {activeTab === "delivery" ? report.delivery : report.review}
                  </p>
                  <div className="order-actions">
                    {activeTab === "review" && (
                      <>
                        <button onClick={() => console.log("View user:", report.user)}>
                          View User
                        </button>
                        <button onClick={() => handleAction(report.id, activeTab)}>
                          Delete Review
                        </button>
                      </>
                    )}
                    {activeTab === "delivery" && (
                      <button onClick={() => handleMarkSolved(report.id)}>Mark as Solved</button>
                    )}
                    {activeTab === "review" && (
                      <button onClick={() => handleMarkSolved(report.id)}>Mark as Solved</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
