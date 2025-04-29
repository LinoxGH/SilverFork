import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import  "./Cart.css";
import NavBar from "../../modules/navbar/NavBar.jsx";




const CartItem = ({ product, onQuantityChange }) => {
  return (
    <div className="cart-item-box">
      
      <div className="cart-item">
        <div className="cart-image"></div>
        <div className="cart-item-details">
          <p className="product-name">{product.menuItem.name}</p>
          <p className="product-description">{product.menuItem.description}</p>
          <div className="quantity-controls">
            <button onClick={() => onQuantityChange(product.id, product.quantity - 1)}>-</button>
            <span>{product.quantity}</span>
            <button onClick={() => onQuantityChange(product.id, product.quantity + 1)}>+</button>
          </div>
        </div>
        <div className="product-price">{product.menuItem.price}$</div>
      </div>

    </div>
  );
};

const CartPage = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/customer/cart", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log(res);

      setProducts(res.data.items)
    })
    .catch((err) => console.error("Failed to load cart:", err));
  }, [token]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await axios.delete(`http://localhost:8080/customer/cart/remove/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(`http://localhost:8080/customer/cart/update/${itemId}?quantity=${newQuantity}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Refresh cart
      const res = await axios.get("http://localhost:8080/customer/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.items);
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  var totalAmount = 0;
  for (let i = 0; i < products.length; i++) {
    totalAmount += products[i].menuItem.price * products[i].quantity;
  }

  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <NavBar />
      <div className={'itemContainer'}>
        <div className="cart-title">
          <h1 >Cart</h1>
        </div>
        <hr className="divider" />
        {products.map((product) => (
          <CartItem
            key={product.id}
            product={product}
            onQuantityChange={handleQuantityChange}
          />
        ))}
        <hr className="divider" />
        <div className="cart-actions">
          <button className="cart-button">Total Amount: {totalAmount}$</button>
          <button className="cart-button" onClick={() => navigate("/")}>Keep Shopping</button>
          <button className="cart-button" onClick={() => navigate("/payment")}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
