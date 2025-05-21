import './App.css';
import ProductCard from "./modules/product/ProductCard.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import RestaurantCard from "./modules/restaurant/RestaurantCard.jsx";

function App() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem("token");
  const rank = localStorage.getItem("rank");

  useEffect(() => {
    // Logged in
    if (token) {
      axios.get("http://localhost:8080/recommends/food/personal", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));

      axios.get("http://localhost:8080/recommends/restaurant/personal", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then((res) => setRestaurants(res.data))
        .catch((err) => console.error(err));

    // Not logged in
    } else {
      axios.get("http://localhost:8080/recommends/food/general")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));

      axios.get("http://localhost:8080/recommends/restaurant/general")
        .then((res) => setRestaurants(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <>
      <div className="recommendations-page">
        <div className="recommendations-container">
          <div className="recommendations-title">Food Recommendations</div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                restaurantName={product.restaurant?.name || "Unknown"}
                handleEdit={null}
                isFavoritable={token !== null}
                isOrderable={token !== null}
              />
            ))}
          </div>
        </div>
        <div className="recommendations-container">
          <div className="recommendations-title">Restaurant Recommendations</div>
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
