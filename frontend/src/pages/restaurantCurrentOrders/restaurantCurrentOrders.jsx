import React, { useEffect, useState } from "react";
import axios from "axios";
import "./restaurantCurrentOrders.css";

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/order/restaurant", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("API response:", res.data); // <--- check here
      setOrders(res.data);
    })
    .catch(err => console.error("Failed to fetch orders:", err));
  }, []);
  

  return (
    <div className="current-orders-page">
      <h2>Current Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-left">
            <div className="food-img">Food Img</div>
            <div className="order-details">
              <p><strong>Order No:</strong> {order.id}</p>
              <p><strong>Date:</strong> {order.orderDate}</p>
              <p><strong>Price:</strong> ${order.totalPrice}</p>
            </div>
            <div className="order-buttons">
              <button>Set Status</button>
              <button>Assign Courier</button>
            </div>
          </div>
          <div className="order-mid">
            <p><strong>Address:</strong></p>
            <p>{order.address?.name}, {order.address?.details}</p>
          </div>
          <div className="order-right">
            <p><strong>Payment:</strong></p>
            <p>Card (assumed dummy data)</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrentOrders;
