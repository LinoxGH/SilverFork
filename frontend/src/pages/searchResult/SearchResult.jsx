import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SearchResult.css";
import NavBar from "../../modules/navbar/NavBar.jsx";

const ShowSearchResult = () => {
  const [sortOption, setSortOption] = useState("none");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [products, setProducts] = useState([]);


  

  const sortProducts = (option) => {
    setSortOption(option);
    let sorted = [...products];
    if (option === "lowest") sorted.sort((a, b) => a.price - b.price);
    if (option === "highest") sorted.sort((a, b) => b.price - a.price);
    if (option === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (option === "new") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (option === "rated") sorted.sort((a, b) => b.rating - a.rating);
    setProducts(sorted);
  };

  const updateMinPrice = () => {
    setRestaurantInfo({ ...restaurantInfo, minCartPrice: minPriceInput });
    console.log("Updated min cart price:", minPriceInput);
  };

  const filterProducts = (cuisine = selectedCuisine) => {
    const min = minFilter === "" ? 0 : Number(minFilter);
    const max = maxFilter === "" ? Infinity : Number(maxFilter);
    const filtered = products.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    setProducts(filtered);
  };

  return (
    <div className="dashboard-container">
      <div>
        <p className="result-text"> X Result Found </p>
      </div>
      <div className="dashboard-body">
        <div className="filters">
          <div className="filter-section">
            <p className="sort-label">Sort By</p>
            <p onClick={() => sortProducts("lowest")} className="sort-option">Lowest Price</p>
            <p onClick={() => sortProducts("highest")} className="sort-option">Highest Price</p>
            <p onClick={() => sortProducts("popular")} className="sort-option">Most Popular</p>
            <p onClick={() => sortProducts("new")} className="sort-option">Newly Added</p>
            <p onClick={() => sortProducts("rated")} className="sort-option">Highest Rated</p>
          </div>
          <div className="filter-section">
            <p className="sort-label">Cuisine</p>
            {['Italian', 'American', 'Turkish', 'Mexican', 'Vegan'].map(cuisine => (
              <p className="sort-option"
                key={cuisine}
                onClick={() => {
                  setSelectedCuisine(cuisine);
                  filterProducts(cuisine);
                }}
              >{cuisine}</p>
            ))}
          </div>
          <div className="filter-section">
            <p className="sort-label">Price</p>
            <div className="price-range">
              <input type="number" placeholder="Min" value={minFilter} onChange={(e) => setMinFilter(e.target.value)} />
              <input type="number" placeholder="Max" value={maxFilter} onChange={(e) => setMaxFilter(e.target.value)} />
              <button onClick={() => filterProducts()}>🔍</button>
            </div>
          </div>
        </div>

        <div className="product-location">
          <h3 className="product-label">Products</h3>
          <div className="products">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-img">Food Img</div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-place">{restaurantInfo.name}</p>
                  <p className="product-rating">{product.description}</p>
                  <p className="product-price">
                    {product.price}$ 
                    <button className="edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
    </div>
  );
};

export default ShowSearchResult;
