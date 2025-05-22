import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./OrderHistory.module.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const rank = localStorage.getItem("rank");
  const apiRank = rank === "RESTAURANT" ? "restaurant" : "user";

  useEffect(() => {
    axios.get(`http://localhost:8080/order/${apiRank}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      // only show completed or cancelled
      const filtered = res.data.filter(order =>
        order.status === "COMPLETED" || order.status === "CANCELLED"
      );
      setOrders(filtered);
    })
    .catch(err => console.error("Failed to fetch order history:", err));
  }, []);

  return (
    <>
      <p className={styles.title}>Order History</p>
      <div className={styles.container}>
        {orders.map(order => (
          <div className={styles.orderContainer} key={order.id}>
            <div className={styles.leftContainer}>
              <div className={styles.infoContainer}>
                <div className={styles.imageContainer}>
                  <img
                    src={`data:image/jpeg;base64,${order.items[0].picture}`}
                    alt="Food"
                    className={styles.orderImage}
                  />
                </div>
                <div className={styles.detailsContainer}>
                  <p><strong>Order No:</strong> {order.id}</p>
                  <p><strong>Date:</strong> {order.orderDate}</p>
                  <p><strong>Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Courier:</strong> {order.courier ? order.courier.user.username : "UNASSIGNED"}</p>
                </div>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <p className={styles.addressTitle}><strong>Address Details</strong></p>
              <p className={styles.addressText}>Name: {order.address?.name}</p>
              <p className={styles.addressText}>Details: {order.address?.details}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderHistory;
