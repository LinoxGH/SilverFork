import React, { useEffect, useState } from "react";
import "./SearchResult.css";
import axios from "axios";
import ProductCard from "../../modules/product/ProductCard.jsx";
import { useParams } from "react-router-dom";
import ProductFilters from "../../modules/product/ProductFilter.jsx";

const ShowSearchResult = () => {
  const { keyword } = useParams();
  const [sortOption, setSortOption] = useState("none");
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [results, setResults] = useState([]);
  const [display, setDisplay] = useState(results);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:8080/search/product",
      params: {
        name: keyword
      }
    }).then((res) => {
      console.log(res.data);
      setResults(res.data);
    }).catch((err) => {
      console.error(err);
    });
  }, [keyword]);

  useEffect(() => {
    setDisplay(results)
  }, [results]);

  const sortProducts = (option) => {
    setSortOption(option);
    let sorted = [...results];
    if (option === "lowest") sorted.sort((a, b) => a.price - b.price);
    if (option === "highest") sorted.sort((a, b) => b.price - a.price);
    if (option === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (option === "new") sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (option === "rated") sorted.sort((a, b) => b.rating - a.rating);
    setDisplay(sorted);
  };

  const filterProducts = () => {
    const min = minFilter === "" ? 0 : Number(minFilter);
    const max = maxFilter === "" ? Infinity : Number(maxFilter);
    let filtered = results.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    filtered = filtered.filter(p =>
      p.cuisine === selectedCuisine
    );
    setDisplay(filtered);
  };

  return (
    <div className="dashboard-container">
      <div>
        <p className="result-text"> {display.length} Result Found </p>
      </div>
      <div className="dashboard-body">
        <ProductFilters
          sortProducts={sortProducts}
          setSelectedCuisine={setSelectedCuisine}
          filterProducts={filterProducts}
          minFilter={minFilter}
          maxFilter={maxFilter}
          setMinFilter={setMinFilter}
          setMaxFilter={setMaxFilter}
        />
        <div className="product-location">
          <h3 className="product-label">Products</h3>
          <div className="products">
            {display.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                restaurantName={product.restaurant.name}
                handleEdit={null}
                isFavoritable={true}
                isOrderable={true}
              />
            ))}
          </div>
        </div>
    </div>
    </div>
  );
};

export default ShowSearchResult;
