import React, { useState, useEffect } from "react";
import "./CartPage.css";

const CartItem = ({ product, onQuantityChange }) => {
  return (
    <div className="cart-item-box">
      <div className="cart-item">
        <div className="cart-image"></div>
        <div className="cart-item-details">
          <p className="product-name">{product.name}</p>
          <p className="product-description">{product.description}</p>
          <div className="quantity-controls">
            <button onClick={() => onQuantityChange(product.id, -1)}>-</button>
            <span>{product.quantity}</span>
            <button onClick={() => onQuantityChange(product.id, 1)}>+</button>
          </div>
        </div>
        <div className="product-price">{product.price}$</div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Example Product",
      description: "This is an example item in the cart.",
      price: 99,
      quantity: 1,
    },
  ]);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Cart</h1>
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
        <button className="cart-button">Keep Shopping</button>
        <button className="cart-button">Place Order</button>
      </div>
    </div>
  );
};

export default CartPage;