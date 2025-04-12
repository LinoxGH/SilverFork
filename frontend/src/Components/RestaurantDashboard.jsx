import React, { useEffect, useState } from "react";
import "./RestaurantDashboard.css";

const RestaurantDashboard = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Sample Restaurant",
    location: "123 Sample Street",
    productCount: 3,
    averageRating: 4.5,
    minCartPrice: 20
  });

  const initialProducts = [
    { id: 1, name: "Burger", cuisine: "American", price: 10, popularity: 80, date: "2023-04-01", rating: 4.2, reviewCount: 12 },
    { id: 2, name: "Pizza", cuisine: "Italian", price: 15, popularity: 95, date: "2023-04-05", rating: 4.8, reviewCount: 30 },
    { id: 3, name: "Doner", cuisine: "Turkish", price: 25, popularity: 70, date: "2023-03-26", rating: 4.6, reviewCount: 20 },
    { id: 4, name: "Taco", cuisine: "Mexican", price: 25, popularity: 70, date: "2023-03-27", rating: 4.6, reviewCount: 20 },
    { id: 5, name: "Vegan Donerasdasd", cuisine: "Vegan", price: 25, popularity: 70, date: "2023-03-29", rating: 4.6, reviewCount: 20 }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [sortOption, setSortOption] = useState("none");
  const [minPriceInput, setMinPriceInput] = useState(restaurantInfo.minCartPrice);
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCuisine, setProductCuisine] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductPrice(editingProduct.price);
      setProductCuisine(editingProduct.cuisine);
    } else {
      setProductName("");
      setProductPrice("");
      setProductCuisine("");
    }
  }, [editingProduct]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
  };

  const handleSubmitProduct = () => {
    if (editingProduct) {
      const updated = products.map(p =>
        p.id === editingProduct.id
          ? { ...editingProduct, name: productName, price: Number(productPrice), cuisine: productCuisine }
          : p
      );
      setProducts(updated);
    } else {
      const newProduct = {
        id: Date.now(),
        name: productName,
        price: Number(productPrice),
        cuisine: productCuisine,
        popularity: 0,
        date: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
      };
      setProducts([...products, newProduct]);
    }
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = () => {
    if (editingProduct) {
      const updated = products.filter(p => p.id !== editingProduct.id);
      setProducts(updated);
      setEditingProduct(null);
      setShowAddProductModal(false);
    }
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

  const updateMinPrice = () => {
    setRestaurantInfo({ ...restaurantInfo, minCartPrice: minPriceInput });
    console.log("Updated min cart price:", minPriceInput);
  };

  const filterProducts = (cuisine = selectedCuisine) => {
    const min = minFilter === "" ? 0 : Number(minFilter);
    const max = maxFilter === "" ? Infinity : Number(maxFilter);
    const filtered = initialProducts.filter(p =>
      p.price >= min &&
      p.price <= max &&
      (cuisine === "" || p.cuisine === cuisine)
    );
    setProducts(filtered);
  };

  return (
    <div className="dashboard-container">
            <div className="restaurant-header">
        <div className="restaurant-main">
            <div className="restaurant-logo">Restaurant Logo</div>
            <div className="restaurant-info">
                <p>{restaurantInfo.name}</p>
                <p>{restaurantInfo.location}</p>
                <p>Product Count: {restaurantInfo.productCount}</p>
                <p>Average Rating: {restaurantInfo.averageRating}⭐️</p>
            </div>
         </div>
        <div className="dashboard-buttons">
          <button>Past Orders</button>
          <button onClick={() => {
            setEditingProduct(null);
            setShowAddProductModal(true);
          }}>Add Product ➕</button>
          <button>Current Orders</button>
          <button>Employed Couriers</button>
        </div>
      </div>

      <hr className="divider" />

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

        <div>
          <h3 className="product-label">Products</h3>
          <div className="products">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-img">Food Img</div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <p className="product-place">{restaurantInfo.name}</p>
                  <p className="product-rating">{product.rating}⭐️ ({product.reviewCount})</p>
                  <p className="product-price">
                    {product.price}$ 
                    <button className="edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="statistics">
          <div className="min-price">
            Minimum Cart Price: 
            <input 
              type="number" 
              value={minPriceInput} 
              onChange={(e) => setMinPriceInput(e.target.value)} 
              onBlur={updateMinPrice} 
            />$
          </div>
          <div className="chart">
            <div className="chart-bars"></div>
            <p>Order Statistics</p>
          </div>
          <div className="chart">
            <div className="chart-bars"></div>
            <p>Earning Statistics</p>
          </div>
        </div>
      </div>
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => {
              setShowAddProductModal(false);
              setEditingProduct(null);
            }}>×</button>
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <input type="text" placeholder="Food Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input type="number" placeholder="Food Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            <input type="text" placeholder="Cuisine" value={productCuisine} onChange={(e) => setProductCuisine(e.target.value)} />
            <button onClick={handleSubmitProduct}>{editingProduct ? "Save Changes" : "Add"}</button>
            {editingProduct && <button className="delete-btn" onClick={handleDeleteProduct}>Delete</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
