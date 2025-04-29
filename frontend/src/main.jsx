import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import Payment from './pages/payment/Payment.jsx';
import Cart from './pages/cart/Cart.jsx';
import RestaurantDashboard from './pages/restaurantDashboard/RestaurantDashboard.jsx';
import Signup from './pages/signup/Signup.jsx';
import Login from './pages/login/Login.jsx';
import ManageUser from './pages/user/ManageUser.jsx';
import Favourites from './pages/favourites/Favourites.jsx';
import ProductDetail from './pages/product/Product.jsx';
import ShowSearchResult from './pages/searchResult/SearchResult.jsx';
import AdminDashboard from './pages/adminDashboard/adminDashboard.jsx';
import AdminManageUser from "./pages/adminManageUser/adminManageUser.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/search-result" element={<ShowSearchResult />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/:username" element={<AdminManageUser />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
