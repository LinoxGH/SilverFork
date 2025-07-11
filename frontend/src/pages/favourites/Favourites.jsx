import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Favourites.css";
import ProductCard from "../../modules/product/ProductCard.jsx";
import ProductFilters from "../../modules/product/ProductFilter.jsx";

const Favourites = () => {
  const token = localStorage.getItem("token");

  const [sortOption, setSortOption] = useState("none");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  const [rawProducts, setRawProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFavourites();
  }, []);
  
  const fetchFavourites = () => {
    axios.get("http://localhost:8080/favourites", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRawProducts(res.data);
      setProducts(res.data);
    })
    .catch(err => console.error("Failed to fetch favourites:", err));
  };

  const sortProducts = (option) => {
    setSortOption(option);
    let sorted = [...rawProducts]; // sort original list
    if (option === "lowest") sorted.sort((a, b) => a.price - b.price);
    if (option === "highest") sorted.sort((a, b) => b.price - a.price);
    if (option === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (option === "new") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (option === "rated") sorted.sort((a, b) => b.rating - a.rating);
    setProducts(sorted);
  };

  const filterProducts = (cuisine = selectedCuisine) => {
    const min = minFilter === "" ? 0 : Number(minFilter);
    const max = maxFilter === "" ? Infinity : Number(maxFilter);
    const filtered = rawProducts.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    setProducts(filtered);
  };

  return (
    <>
      <div className="favourites-page">
        <p className="favourites-title">My favourites</p>
        <div className="favourites-layout">
          <ProductFilters
            sortProducts={sortProducts}
            setSelectedCuisine={setSelectedCuisine}
            filterProducts={filterProducts}
            minFilter={minFilter}
            maxFilter={maxFilter}
            setMinFilter={setMinFilter}
            setMaxFilter={setMaxFilter}
          />
          <div className="favourites-content">
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  restaurantName={product.restaurant?.name}
                  handleEdit={null}
                  isFavoritable={true}
                  isOrderable={true}
                  onRefresh={fetchFavourites}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Favourites;
