import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import PaymentPage from './modules/PaymentPage.jsx';
import CartPage from './modules/CartPage.jsx';
import RestaurantDashboard from './modules/RestaurantDashboard.jsx';
import Signup from './modules/Signup.jsx';
import Login from './modules/Login.jsx'; // if needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/restaurant" element={<RestaurantDashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
