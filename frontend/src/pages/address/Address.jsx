import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './Address.module.css';
import AddressCard from "../../modules/user/AddressCard.jsx";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
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

  const onEdit = (address) => {
    setEditing(address);
    setNewAddress({ name: address.name, details: address.details });
  };

  const handleSubmit = () => {
    if (!newAddress.name || !newAddress.details) return alert("Please fill all fields");

    if (editing) {
      axios.put(`http://localhost:8080/address/update/${editing.id}`, newAddress, { headers })
        .then(() => {
          setEditing(null);
          setNewAddress({ name: "", details: "" });
          fetchAddresses();
        })
        .catch(() => alert("Failed to update address"));
    } else {
      axios.post("http://localhost:8080/address/add", newAddress, { headers })
        .then(() => {
          setNewAddress({ name: "", details: "" });
          fetchAddresses();
        })
        .catch(() => alert("Failed to add address"));
    }
  };

  return (
    <div className={"address-page-parent"}>
      <h2>ADDRESSES</h2>
      <div className={"address-form"}>
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
        <button onClick={handleSubmit}>{editing ? "Update" : "Add"} Address</button>
        {editing && <button onClick={() => { setEditing(null); setNewAddress({ name: "", details: "" }); }}>Cancel</button>}
      </div>

      <div className={"address-page"}>
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default Addresses;