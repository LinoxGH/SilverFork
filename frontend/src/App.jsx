import './App.css';
import ProductCard from "./modules/general/ProductCard.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const endpoint = token
      ? "http://localhost:8080/recommendations/personal"
      : "http://localhost:8080/recommendations/general";

    axios.get(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch recommendations:", err));
  }, [token]);

  return (
    <>
      <div className="recommendations-page">
        <h1 className="recommendations-title">Recommendations</h1>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              restaurantName={product.restaurant?.name || "Unknown"}
              handleEdit={null}
              isFavoritable={true}
              isOrderable={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
