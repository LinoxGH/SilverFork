import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./courierDashboard.module.css";

const CourierDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0, // TODO
    available: true, // TODO
  });
  const [registered, setRegistered] = useState([]); // TODO

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8080/courier/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setAssignments(res.data))
    .catch(err => console.error("Failed to fetch assignments:", err));




    document.getElementById("availability-check").checked = stats.available;
  }, []);

  function onCheckboxClick(event) {
    axios.put("http://localhost:8080/courier/update-status", null,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        status: event.target.checked ? "AVAILABLE" : "UNAVAILABLE"
      }
    })
    .then(res => {
      stats.available = event.target.checked;
      document.getElementById("availability-label").innerHTML = (stats.available ? " Available" : " Unavailable") + " to make deliveries."
    })
    .catch(err => console.error("Failed to update status:", err))
  }

  return (
    <div className={styles.courierDashboard}>
      <div className={styles.dashboardBody}>
        <div className={styles.leftPanel}>
          <div className={styles.assignmentsList}>
            {assignments.map((item) => (
              <div
                key={item.id}
                className={styles.assignmentCard}
                //onClick={() => navigate(`/admin-dashboard/${encodeURIComponent(acc.username)}`)}
              >
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.stats}>
            <p>Total Deliveries Made: {stats.totalDeliveries}</p>
            <div>
              <input
                type="checkbox"
                id="availability-check"
                name="availability"
                onChange={onCheckboxClick}
              />
              <label id="availability-label">{(stats.available ? " Available" : " Unavailable") + " to make deliveries."}</label>
            </div>
          </div>
          <hr />
          <button className={styles.viewRestaurants}>View Restaurants</button>
          <button className={styles.viewRestaurants}>Delivery History</button>
        </div>
      </div>
    </div>
  );
};

export default CourierDashboard;
