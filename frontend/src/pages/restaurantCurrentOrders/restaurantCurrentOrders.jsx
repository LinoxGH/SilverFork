import React, { useEffect, useState } from "react";
import axios from "axios";
import "./restaurantCurrentOrders.css";

const statusOptions = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [openStatusId, setOpenStatusId] = useState(null);
  const [openCourierId, setOpenCourierId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/order/restaurant", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error("Failed to fetch orders:", err));

    axios.get("http://localhost:8080/order/restaurant/couriers", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCouriers(res.data))
    .catch(err => console.error("Failed to fetch couriers:", err));
  }, []);

  const updateStatus = (orderId, status) => {
    axios.put(`http://localhost:8080/order/${orderId}/status`, null, {
      params: { status },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setOpenStatusId(null);
    })
    .catch(err => {
      console.error("Failed to update status:", err);
      alert("Status update failed.");
    });
  };

  const assignCourier = (orderId, courierId) => {
    axios.put(`http://localhost:8080/order/${orderId}/assignCourier`, null, {
      params: { courierId },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Courier assigned!");
      setOpenCourierId(null);
    })
    .catch(err => {
      console.error("Failed to assign courier:", err);
      alert("Assignment failed.");
    });
  };

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
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            <div className="order-buttons">
              <button onClick={() => setOpenStatusId(order.id)}>Set Status</button>
              {openStatusId === order.id && (
                <select
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
              <button onClick={() => setOpenCourierId(order.id)}>Assign Courier</button>
              {openCourierId === order.id && (
                <select
                  onChange={(e) => assignCourier(order.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select courier</option>
                  {couriers.map(courier => (
                    <option key={courier.id} value={courier.id}>
                      {courier.username}
                    </option>
                  ))}
                </select>
              )}
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
