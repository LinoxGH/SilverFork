import React, {useEffect, useState} from "react";
import axios from "axios";
import styles from "./CurrentOrders.module.css";
import Button from "../../modules/general/Button.jsx";

const statusOptions = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];

const CurrentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [openStatusId, setOpenStatusId] = useState(null);
  const [openCourierId, setOpenCourierId] = useState(null);

  const token = localStorage.getItem("token");
  const rank = localStorage.getItem("rank");
  const apiRank = rank === "RESTAURANT" ? "restaurant" : "user";

  useEffect(() => {
    axios.get(`http://localhost:8080/order/${apiRank}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch orders:", err));

    if (rank === "RESTAURANT") {
      axios.get("http://localhost:8080/order/restaurant/couriers", {
        headers: {Authorization: `Bearer ${token}`}
      })
        .then(res => setCouriers(res.data))
        .catch(err => console.error("Failed to fetch couriers:", err));
    }
  }, []);

  const updateStatus = (orderId, status) => {
    if (rank === "RESTAURANT") {
      axios.put(`http://localhost:8080/order/${orderId}/status`, null, {
        params: {status},
        headers: {Authorization: `Bearer ${token}`}
      })
        .then(() => {
          setOrders(prev =>
            prev.map(order =>
              order.id === orderId ? {...order, status} : order
            )
          );
          setOpenStatusId(null);
        })
        .catch(err => {
          console.error("Failed to update status:", err);
          alert("Status update failed.");
        });
    }
  };

  const assignCourier = (orderId, courierId) => {
    if (rank === "RESTAURANT") {
      axios.put(`http://localhost:8080/order/${orderId}/assignCourier`, null, {
        params: {courierId},
        headers: {Authorization: `Bearer ${token}`}
      })
        .then(() => {
          alert("Courier assigned!");
          setOpenCourierId(null);
        })
        .catch(err => {
          console.error("Failed to assign courier:", err);
          alert("Assignment failed.");
        });
    }
  };

  const handleReportOrder = (orderId) => {
    const reason = prompt("Enter your reasoning for reporting the order:");
    if (!reason) return;
    if (reason.length > 100) {
      alert("Report reasons can be at maximum 100 characters!")
      return;
    }

    axios.post(`http://localhost:8080/order-disputes/create/${orderId}`, null, {
      params: {reason: reason},
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(() => alert("Successfully reported this order. Our admins will handle this as soon as possible. Thank you for your patience."))
      .catch(err => console.error("Failed to submit order report:", err));
  };

  return (
    <>
      <p className={styles.title}>Current Orders</p>
      <div className={styles.container}>
        {orders
          .filter(order => order.status !== "COMPLETED" && order.status !== "CANCELLED")
          .map((order) => (
          <div className={styles.orderContainer} key={order.id}>
            <div className={styles.leftContainer}>
              <div className={styles.infoContainer}>
                <div className={styles.imageContainer}>
                  <img src={`data:image/jpeg;base64,${order.items[0].picture}`} alt={"Food Image"} className={styles.orderImage}/>
                </div>
                <div className={styles.detailsContainer}>
                  <p><strong>Order No:</strong> {order.id}</p>
                  <p><strong>Date:</strong> {order.orderDate}</p>
                  <p><strong>Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Courier:</strong> {order.courier ? order.courier.user.username : "UNASSIGNED"}</p>
                </div>
              </div>
              {rank === "RESTAURANT" && (
                <div className={styles.buttonsContainer}>
                  <Button
                    label={"Set Status"}
                    onClick={() => {
                      setOpenStatusId(order.id);
                      setOpenCourierId(null);
                    }}
                    width={"90%"}
                    margin={"2% 1% 2% 1%"}
                    borderRadius={"15px"}
                    background={"#000000"}/>

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
                  <Button
                    label={"Assign Courier"}
                    onClick={() => {
                      setOpenCourierId(order.id);
                      setOpenStatusId(null);
                    }}
                    width={"90%"}
                    margin={"2% 1% 2% 1%"}
                    borderRadius={"15px"}
                    background={"#000000"}/>

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
              )}
              {rank === "CUSTOMER" && (
                <div className={styles.buttonsContainer}>
                  <Button
                    label={"Report Order"}
                    onClick={() => handleReportOrder(order.id)}
                    width={"90%"}
                    margin={"2% 1% 2% 1%"}
                    borderRadius={"15px"}
                    background={"#000000"}/>
                </div>
              )}
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

export default CurrentOrders;
