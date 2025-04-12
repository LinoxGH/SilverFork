import React, { useState } from 'react';
import TextBox from '.TextBox.jsx';
import Checkbox from './Checkbox.jsx';
import './Payment.module.css';
import Button from './Button.jsx';

function PaymentPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleInputChange = (event, setState) => {
        setState(event.target.value);
    };

    const handleCheckboxChange = () => {
        setTermsAccepted(!termsAccepted);
    };

    const handleConfirm = () => {
        if (!name || !surname || !cardNumber || !cvv || !expiryDate || !address || !deliveryDate || !termsAccepted) {
            alert('Please fill in all fields and accept the terms and conditions.');
        } else {
            //GET CONFIRMATION
        }
    }
    
    return (
        <>
            <div className="payment-label">Payment</div>
            <div className="payment-box"></div>
            <TextBox placeholder="Name" width="270px" height="50px" top="210px" left="400px" value={name} onChange={(event) => handleInputChange(event, setName)}/>
            <TextBox placeholder="Surname" width="270px" height="50px" top="210px" left="700px" value={surname} onChange={(event) => handleInputChange(event, setSurname)}/>
            <TextBox placeholder="Card Number" width="570px" height="50px" top="290px" left="400px" value={cardNumber} onChange={(event) => handleInputChange(event, setCardNumber)}/>
            <TextBox placeholder="CVV" width="270px" height="50px" top="370px" left="400px" value={cvv} onChange={(event) => handleInputChange(event, setCvv)}/>
            <TextBox placeholder="MM/YY" width="270px" height="50px" top="370px" left="700px" value={expiryDate} onChange={(event) => handleInputChange(event, setExpiryDate)}/>
            <TextBox placeholder="" width="570px" height="100px" top="490px" left="400px" value={address} onChange={(event) => handleInputChange(event, setAddress)}/>
            <TextBox placeholder="" width="270px" height="50px" top="660px" left="400px" value={deliveryDate} onChange={(event) => handleInputChange(event, setDeliveryDate)}/>
            <Checkbox width= "32px" height= "32px" top = "670px" left = "1050px" checked={termsAccepted} onChange={handleCheckboxChange}/>
            <div className="adress-label">Adress</div>
            <div className="delivery-label">Delivery Date</div>
            <div className="addInfo-label">Terms of Service etc.</div>
            <div className="checkBox-label">I have read and agree to Terms of Service.</div>

            <Button label="Confirm Payment" onClick={handleConfirm} width="270px" height="50px" position="absolute" top="660px" left="710px"/>
        </>
    );
}

export default PaymentPage;