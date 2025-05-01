import './App.css';
import NavBar from "./modules/navbar/NavBar.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8080/restaurant/menu/items/restaurant1", {
    })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, [token]);

  const addToCart = async (productId) => {
    axios({
      method: "POST",
      url: "http://localhost:8080/customer/cart/add",
      headers: { Authorization: `Bearer ${token}` },
      params: {
        menuItemId: productId,
        quantity: 1
      }
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className='welcome-text'>
        <h1>Welcome to the Simple Page</h1>
      </div>
      
      <div>
        {products.map((product) => (
          <button key={product.id} onClick={() => addToCart(product.id)}>{product.name}</button>
        ))}
      </div>
    </>
  );
}

export default App;