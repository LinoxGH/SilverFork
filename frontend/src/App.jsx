import './App.css';
import NavBar from "./modules/navbar/NavBar.jsx";
import ProductCard from "./modules/general/ProductCard.jsx";
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    /*axios.get("http://localhost:8080/restaurant/menu/items/restaurant1")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.error("Failed to load products:", err));*/
  }, []);

  const addToCart = async (product) => {
    try {
      await axios.post("http://localhost:8080/customer/cart/add", null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          menuItemId: product.id,
          quantity: 1
        }
      });
      console.log("Added to cart:", product.name);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

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
              onButtonClick={addToCart}
              buttonLabel="＋"
              showHeart={true}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
