import React from "react";
import './AddressCard.module.css';

const AddressCard = ({ address, onEdit }) => {
  return (
    <div>
      <div className="address-card">
        <div className="address-header">
          <h3>{address.name}</h3>
          <button onClick={() => onEdit(address)}>Edit</button>
        </div>
        <div className="address-details">
          <h3>{address.details}</h3>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;