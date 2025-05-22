import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Payment.module.css';


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
    <div className={styles.container}>
      <h2 className={styles.heading}>Payment</h2>
      <div className={styles.form}>
        <div className={styles.left}>
  
          <div className={styles.row}>
            <input className={`${styles.input} ${styles.shortInput}`} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className={`${styles.input} ${styles.shortInput}`} placeholder="Surname" value={surname} onChange={e => setSurname(e.target.value)} />
          </div>
  
          <div className={styles.row}>
            <input className={`${styles.input} ${styles.cardNumber}`} placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
          </div>
  
          <div className={styles.row}>
            <input className={`${styles.input} ${styles.shortInput}`} placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value)} />
            <input className={`${styles.input} ${styles.shortInput}`} placeholder="MM / YY" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
          </div>
  
          <div className={styles.column}>
            <label className={styles.label}>Address</label>
            <select className={styles.select} value={selectedAddressId} onChange={e => setSelectedAddressId(e.target.value)}>
              <option value="">Select Address</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name} – {addr.details.substring(0, Math.min(60, addr.details.length))}
                </option>
              ))}
            </select>
          </div>
  
          <div className={`${styles.row} ${styles.alignEnd}`}>
            <div className={styles.column}>
              <label className={styles.label}>Delivery Date</label>
              <input className={`${styles.input} ${styles.shortInput}`} type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            </div>
            <button className={styles.button} onClick={confirmOrder}>Confirm Payment</button>
          </div>
  
        </div>
  
        <div className={styles.right}>
          <p><strong>Additional information:</strong></p>
          <p>Terms of Service,<br />Legal procedures etc.</p>
          <div className={styles.checkboxRow}>
            <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
            <label htmlFor="terms">
              I have read and agree to Terms of Service.
            </label>
          </div>
        </div>
      </div>
    </div>
  );  
  
}

export default PaymentPage;
