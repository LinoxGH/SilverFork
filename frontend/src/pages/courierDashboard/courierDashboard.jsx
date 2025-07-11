import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./courierDashboard.module.css";
import RestaurantCard from "../../modules/restaurant/RestaurantCard.jsx";
import AssignmentCard from "../../modules/courier/AssignmentCard.jsx";

const CourierDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState("");
  const [registered, setRegistered] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Status
    axios.get("http://localhost:8080/courier/status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setStatus(res.data))
    .catch(err => console.error("Failed to fetch status:", err));

    // Fetch Assignments
    axios.get("http://localhost:8080/courier/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log(res.data);
        setAssignments(res.data.filter((item) => item.status === "On the Road"));
      })
      .catch(err => console.error("Failed to fetch assignments:", err));

    // Fetch Registered Restaurants
    axios.get("http://localhost:8080/courier/registered-restaurants", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setRegistered(res.data))
      .catch(err => console.error("Failed to fetch registered restaurants:", err));
  }, []);

  useEffect(() => {
    document.getElementById("availability-label").innerHTML = status + " to make deliveries.";
    document.getElementById("availability-check").checked = status === "AVAILABLE";
  }, [status]);

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
      setStatus(event.target.checked ? "AVAILABLE" : "UNAVAILABLE");
    })
    .catch(err => console.error("Failed to update status:", err))
  }

  return (
    <div className={styles.courierDashboard}>
      <div className={styles.dashboardBody}>
        <div className={styles.leftPanel}>
          <h1 className={styles.assignmentsListTitle}>Given Delivery Assignments</h1>
          <div className={styles.assignmentsList}>
            {assignments.map((item) => (
              <AssignmentCard
                key={item.id}
                assignment={item}
              />
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.stats}>
            <input
              type="checkbox"
              id="availability-check"
              name="availability"
              onChange={onCheckboxClick}
            />
            <label className={styles.availabilityLabel} id="availability-label">{status + " to make deliveries."}</label>
          </div>
          <div className={styles.restaurantsList}>
            <h1 className={styles.restaurantsListTitle}>Registered Restaurants</h1>
            {registered.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourierDashboard;
