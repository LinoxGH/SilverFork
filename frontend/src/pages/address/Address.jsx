import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './Address.module.css';
import AddressCard from "../../modules/user/AddressCard.jsx";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/address/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAddresses(res.data);
        console.log(res);
      })
      .catch((err) => console.error("Failed to load addresses: ", err));
  }, [token]);

  const onEdit = async (address) => {
    setEditing(address);
  };

  return (
    <div className={"address-page-parent"}>
      <h2>ADDRESSES</h2>
      <div className={"address-page"}>
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onEdit={onEdit}/>
        ))}
      </div>
    </div>
  );
};

export default Addresses;