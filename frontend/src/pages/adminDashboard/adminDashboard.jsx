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
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery");
  const [orderDisputes, setOrderDisputes] = useState([]);
  const [reviewDisputes, setReviewDisputes] = useState([]);

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

  useEffect(() => {
    if (!showModal) return;

    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/order-disputes", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrderDisputes(res.data))
      .catch(err => console.error("Failed to fetch order disputes:", err));

    axios.get("http://localhost:8080/review-disputes", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReviewDisputes(res.data))
      .catch(err => console.error("Failed to fetch review disputes:", err));
  }, [showModal]);

  //might need fixing
  const filteredAccounts = accounts.filter(acc =>
    acc.username.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id, type) => {
  const token = localStorage.getItem("token");
  const url = type === "delivery"
    ? `http://localhost:8080/order-disputes/${id}`
    : `http://localhost:8080/review-disputes/${id}`;

  axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      if (type === "delivery") {
        setOrderDisputes(prev => prev.filter(r => r.id !== id));
      } else {
        setReviewDisputes(prev => prev.filter(r => r.id !== id));
      }
    })
    .catch(err => console.error("Failed to delete report:", err));
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
              {(activeTab === "delivery" ? orderDisputes : reviewDisputes).map((report) => (
                <div key={report.id} className="order-card">
                  <p><strong>ID:</strong> {report.id}</p>
                  <p><strong>Description:</strong> {report.reason}</p>
                  <p><strong>
                    {activeTab === "review" ? "Reporting Restaurant:" : "Reporting User:"}
                  </strong> {report.raisedBy.username}</p>
                  <p>
                    <strong>
                      {activeTab === "delivery" ? "Reported Delivery:" : "Reported Review:"}
                    </strong> {activeTab === "delivery" ? `Order #${report.order.id}` : `Review #${report.review.id}`}
                  </p>
                  <div className="order-actions">
                    {activeTab === "review" && (
                      <>
                        <button onClick={() => navigate(`/admin-dashboard/${encodeURIComponent(report.review.user.username)}`)}>
                          View User
                        </button>
                        <button onClick={() => handleDelete(report.id, "review")}>
                          Delete Review
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(report.id, activeTab)}>Mark as Solved</button>
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
