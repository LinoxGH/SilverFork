import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Payment.module.css';


function PaymentPage() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/address/list", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAddresses(res.data))
    .catch(err => console.error("Failed to fetch addresses", err));
  }, []);

  const confirmOrder = () => {
    if (!termsAccepted || !selectedAddressId) {
      alert("Please accept terms and select an address.");
      return;
    }

    axios.post(`http://localhost:8080/order/create`, null, {
      params: { addressId: selectedAddressId },
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => alert("Order placed successfully!"))
    .catch(err => alert("Order failed."));
  };

  return (
    <div>
      <h2>Payment</h2>
      <div>
        <div>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <input placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} />
        </div>
        <div>
          <input placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
        </div>
        <div>
          <input placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
        </div>
        <div>
          <input placeholder="MM / YY" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        </div>
        <div>
          <label>Address</label>
          <select value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)}>
            <option value="">Select Address</option>
            {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                    {addr.name} – {addr.details}
                </option>
                ))}
          </select>
        </div>
        <div>
          <label>Delivery Date</label>
          <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
        </div>
        <div>
          <button onClick={confirmOrder}>Confirm Payment</button>
        </div>
        <div>
          <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
          <label>I have read and agree to Terms of Service.</label>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
