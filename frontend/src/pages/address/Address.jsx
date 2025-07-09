import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './Address.module.css';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null); // if not null, we're editing
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", details: "" });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAddresses = () => {
    axios.get("http://localhost:8080/address/list", { headers })
      .then((res) => setAddresses(res.data))
      .catch((err) => console.error("Failed to load addresses: ", err));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setNewAddress({ name: "", details: "" });
    setShowModal(true);
  };

  const openEditModal = (address) => {
    setEditing(address);
    setNewAddress({ name: address.name, details: address.details });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setNewAddress({ name: "", details: "" });
  };

  const handleSubmit = () => {
    if (!newAddress.name || !newAddress.details) {
      return alert("Please fill all fields");
    }

    if (newAddress.name.length > 20) {
      return alert("Address names should be less than 20 characters!");
    }

    if (newAddress.details.length > 100) {
      return alert("Address details should be less than 100 characters!");
    }

    if (editing) {
      axios.put(`http://localhost:8080/address/update/${editing.id}`, newAddress, { headers })
        .then(() => {
          closeModal();
          fetchAddresses();
        })
        .catch(() => alert("Failed to update address"));
    } else {
      axios.post("http://localhost:8080/address/add", newAddress, { headers })
        .then(() => {
          closeModal();
          fetchAddresses();
        })
        .catch(() => alert("Failed to add address"));
    }
  };

  const deleteAddress = () => {
    if (!editing) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    axios.delete(`http://localhost:8080/address/delete/${editing.id}`, { headers })
      .then(() => {
        closeModal();
        fetchAddresses();
      })
      .catch(() => alert("Failed to delete address"));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Addresses</h1>
      <hr className={styles.divider} />

      {/* Scrollable List */}
      <div className={styles.scrollArea}>
        {addresses.map((address) => (
          <div className={styles.addressCard} key={address.id}>
            <div>
              <p className={styles.addressTitle}>{address.name}</p>
              <p className={styles.addressDetails}>{address.details}</p>
            </div>
            <button className={styles.editButton} onClick={() => openEditModal(address)}>Edit</button>
          </div>
        ))}
      </div>

      <hr className={styles.divider} />
      <div className={styles.footer}>
        <button className={styles.addButton} onClick={openAddModal}>Add new address</button>
      </div>

      {/* Shared Add/Edit Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={closeModal}>×</button>
            <h2>{editing ? "Edit Address" : "Add Address"}</h2>
            <input
              type="text"
              placeholder="Address Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address Details"
              value={newAddress.details}
              onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleSubmit}>
                {editing ? "Update Address" : "Add Address"}
              </button>
              {editing && (
                <button onClick={deleteAddress}>Delete</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;


