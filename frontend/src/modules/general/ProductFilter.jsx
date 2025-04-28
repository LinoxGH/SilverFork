import React from "react";
import "./ProductFilter.css";

const ProductFilters = ({
  sortProducts,
  setSelectedCuisine,
  filterProducts,
  minFilter,
  maxFilter,
  setMinFilter,
  setMaxFilter,
}) => {
  const cuisines = ['Italian', 'American', 'Turkish', 'Mexican', 'Vegan'];

  return (
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
        {cuisines.map(cuisine => (
          <p
            className="sort-option"
            key={cuisine}
            onClick={() => {
              setSelectedCuisine(cuisine);
              filterProducts(cuisine);
            }}
          >
            {cuisine}
          </p>
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
  );
};

export default ProductFilters;
