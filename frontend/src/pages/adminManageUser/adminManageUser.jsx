import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminManageUser.css";

const AdminManageUser = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddressesModal, setShowAddressesModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);

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
    setShowRankModal(true);
  };
  
  const sendNewRank = (newRank) => {
    axios.put(`http://localhost:8080/admin/users/${username}/rank`, null, {
      headers,
      params: { rank: newRank }
    })
      .then(() => {
        alert("Rank updated");
        setShowRankModal(false);
      })
      .catch(err => alert("Failed to update rank"));
  };

  const viewAddresses = () => {
    axios.get(`http://localhost:8080/admin/users/${username}/addresses`, { headers })
      .then(res => {
        setAddresses(res.data);
        setShowAddressesModal(true);
      })
      .catch(err => alert("Failed to fetch addresses"));
  };

  const viewOrders = () => {
    axios.get(`http://localhost:8080/admin/user/orders/${username}`, { headers })
      .then(res => {
        setOrders(res.data);
        setShowOrdersModal(true);
      })
      .catch(err => alert("Failed to fetch orders"));
  };

  const handleOrderChange = (id, field, value) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? {
              ...order,
              [field]:
                field === "courier"
                  ? value
                    ? { id: parseInt(value) }
                    : null
                  : value
            }
          : order
      )
    );
  };
  

  const updateOrder = (id) => {
    const order = orders.find(o => o.id === id);
    axios.put(`http://localhost:8080/admin/user/orders/update/${id}`, order, { headers })
      .then(() => alert("Order updated"))
      .catch(err => alert("Update failed"));
  };

  const deleteOrder = (id) => {
    axios.delete(`http://localhost:8080/admin/user/orders/delete/${id}`, { headers })
      .then(() => {
        alert("Order deleted");
        setOrders(prev => prev.filter(o => o.id !== id));
      })
      .catch(err => alert("Delete failed"));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-manage-user">
      <div className="user-container">
        <div className="user-info-section">
          <h1>{user.username}</h1>
          <hr className="user-divider" />
          <input className="email-display" value={user.email} readOnly />

          <div className="button-grid">
            <button onClick={viewAddresses}>View Addresses</button>
            <button onClick={deleteUser}>Delete Account</button>
            <button onClick={viewOrders}>View Order History</button>
            <button onClick={() => updateStatus("BANNED")}>Ban Account</button>
            <button onClick={() => updateStatus("RESTRICTED")}>Restrict Account</button>
            <button onClick={changeRank}>Change Rank</button>
          </div>

          <hr className="user-divider" />
        </div>

        <div className="user-image-placeholder">
          {user.base64Image ? (
            <img src={`data:image/jpeg;base64,${user.base64Image}`} alt={"Account Image"} className="user-image-img" />
          ) : (
            <div className="user-image-placeholder-text">Account Image</div>
          )}
        </div>
      </div>

      {/* Addresses Modal */}
      {showAddressesModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Addresses</h2>
            <ul>
              {addresses.map(addr => (
                <li key={addr.id}>
                  <strong>{addr.name}:</strong> {addr.details}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowAddressesModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="modal">
          <div className="modal-content wide">
            <button className="modal-close" onClick={() => setShowOrdersModal(false)}>×</button>
            <h2>Order History</h2>
            <div className="order-list">
              {orders.map(order => (
                <div className="order-card" key={order.id}>
                  <p><strong>Order Date:</strong> {order.orderDate}</p>
                  <p><strong>Status:</strong>
                    <select
                      value={order.status}
                      onChange={e => handleOrderChange(order.id, "status", e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="ON_THE_ROAD">On the Road</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </p>
                  <p><strong>Total Price:</strong> ₺{order.totalPrice}</p>
                  <p><strong>Address:</strong> {order.address?.details || 'N/A'}</p>
                  <p><strong>Restaurant:</strong> {order.restaurant?.name || 'N/A'}</p>
                  <p><strong>Courier:</strong> {order.courier?.username || '-'}</p>
                  <p><strong>Courier ID:</strong>
                    <input
                      type="number"
                      placeholder="Enter courier ID"
                      value={order.courier?.id || ""}
                      onChange={(e) => handleOrderChange(order.id, "courier", e.target.value)}
                    />
                  </p>

                  <div className="order-items">
                    <p><strong>Items:</strong></p>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.menuItem?.name} × {item.quantity} (₺{item.priceAtOrder})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-actions">
                    <button onClick={() => updateOrder(order.id)}>Update</button>
                    <button onClick={() => deleteOrder(order.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showRankModal && (
        <div className="modal">
          <div className="modal-content rank-modal">
            <button className="modal-close" onClick={() => setShowRankModal(false)}>×</button>
            <h2>Select New Rank</h2>
            <div className="rank-options">
              <button onClick={() => sendNewRank("ADMIN")}>ADMIN</button>
              <button onClick={() => sendNewRank("COURIER")}>COURIER</button>
              <button onClick={() => sendNewRank("CUSTOMER")}>CUSTOMER</button>
              <button onClick={() => sendNewRank("RESTAURANT")}>RESTAURANT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUser;