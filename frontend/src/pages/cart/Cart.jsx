import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import  "./Cart.css";

const CartItem = ({ product, onQuantityChange }) => {
  const imagePreview = product.menuItem.base64Image ? `data:image/jpeg;base64,${product.menuItem.base64Image}` : null;

  return (
    <div className="cart-item-box">
      <div className="cart-item">
        <div className="cart-image">
          {imagePreview !== null && (<img src={imagePreview} alt={"Product Image"} className="cart-image-img"></img>)}
        </div>
        <div className="cart-item-details">
          <p className="product-name">{product.menuItem.name}</p>
          <p className="product-description">{product.menuItem.description}</p>
          <div className="quantity-controls">
            <button onClick={() => onQuantityChange(product.id, product.quantity - 1)}>-</button>
            <span>{product.quantity}</span>
            <button onClick={() => onQuantityChange(product.id, product.quantity + 1)}>+</button>
          </div>
        </div>
        <div className="product-price">{product.menuItem.price.toFixed(2)}$</div>
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

  let totalAmount = products.reduce((sum, item) => {
    const roundedPrice = parseFloat(item.menuItem.price.toFixed(2));
    return sum + roundedPrice * item.quantity;
  }, 0);
  totalAmount = totalAmount.toFixed(2);

  const navigate = useNavigate();

  return (
    <div className="cart-container">
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
