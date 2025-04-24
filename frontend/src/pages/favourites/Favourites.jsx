import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Favourites.css";
import NavBar from "../../modules/navbar/NavBar.jsx";
import ProductCard from "../../modules/general/ProductCard.jsx";
import ProductFilters from "../../modules/general/ProductFilter.jsx";


const Favourites = () => {

  const token = localStorage.getItem("token");

  const [sortOption, setSortOption] = useState("none");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [products, setProducts] = useState([]);


  useEffect(() => {
      const token = localStorage.getItem("token");
  
      axios.get("http://localhost:8080/favourites", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch favourites:", err));
    }, []);

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
    <><NavBar/>
    <div className="favourites-page">
      <p className="favourites-title">My favourites</p>
      <div> 
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
                restaurantName={product.restaurantName}
                onButtonClick={addToCart}
                buttonLabel="＋"
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