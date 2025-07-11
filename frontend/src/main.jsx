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
import Adresses from './pages/address/Address.jsx';
import Favourites from './pages/favourites/Favourites.jsx';
import ProductDetail from './pages/product/Product.jsx';
import ShowSearchResult from './pages/searchResult/SearchResult.jsx';
import AdminDashboard from './pages/adminDashboard/adminDashboard.jsx';
import AdminManageUser from "./pages/adminManageUser/adminManageUser.jsx";
import ProtectedRoute from "./modules/general/ProtectedRoute.jsx";
import NavBar from "./modules/navbar/NavBar.jsx";
import CurrentOrders from "./pages/currentOrders/CurrentOrders.jsx";
import CourierDashboard from "./pages/courierDashboard/courierDashboard.jsx";
import Restaurant from "./pages/restaurant/Restaurant.jsx";
import OrderHistory from "./pages/orderHistory/OrderHistory.jsx";
import Footer from "./modules/footer/Footer.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/address" element={<Adresses />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/search-result/:keyword" element={<ShowSearchResult />} />
        <Route path="/current-orders" element={<CurrentOrders />} />
        <Route path="/restaurant/:restaurantId" element={<Restaurant />} />
        <Route path="/restaurant-dashboard" element={
          <ProtectedRoute allowedRoles={['RESTAURANT']}>
            <RestaurantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/order-history" element={
          <ProtectedRoute allowedRoles={['RESTAURANT']}>
            <OrderHistory />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard/:username" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminManageUser />
          </ProtectedRoute>
        } />
        <Route path="/courier-dashboard" element={
          <ProtectedRoute allowedRoles={['COURIER']}>
            <CourierDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer/>
    </BrowserRouter>
  </StrictMode>
);
