import './App.css';
import ProductCard from "./modules/product/ProductCard.jsx";
import React, { useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

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
