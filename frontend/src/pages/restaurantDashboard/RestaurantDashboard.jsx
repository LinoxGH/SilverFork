import axios from "axios";
import React, { useEffect, useState } from "react";
import "./RestaurantDashboard.css";
import NavBar from "../../modules/navbar/NavBar.jsx";

const RestaurantDashboard = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Sample Restaurant",
    location: "123 Sample Street",
    productCount: 3,
    averageRating: 4.5,
    minCartPrice: 20
  });

  const [sortOption, setSortOption] = useState("none");
  const [minPriceInput, setMinPriceInput] = useState(restaurantInfo.minCartPrice);
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/restaurant/menu", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProducts(res.data))
    .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductPrice(editingProduct.price);
      setProductDescription(editingProduct.description || "");
    } else {
      setProductName("");
      setProductPrice("");
      setProductDescription("");
    }
  }, [editingProduct]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
  };

  const handleSubmitProduct = async () => {
    const token = localStorage.getItem("token");

    const productData = {
      name: productName,
      price: Number(productPrice),
      description: productDescription,
      picture: null
    };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8080/restaurant/menu/update/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:8080/restaurant/menu/add", productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const res = await axios.get("http://localhost:8080/restaurant/menu", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);

      setShowAddProductModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Product submission failed:", err);
      alert("Something went wrong while saving the product.");
    }
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8080/restaurant/menu/delete/${editingProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const res = await axios.get("http://localhost:8080/restaurant/menu", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);

      setEditingProduct(null);
      setShowAddProductModal(false);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Could not delete product.");
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
    const filtered = products.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    setProducts(filtered);
  };

  return (
    <div className="dashboard-container">
      <NavBar/>
      <div className="restaurant-header">
        <div className="restaurant-main">
          <div className="restaurant-logo">Restaurant Logo</div>
          <div className="restaurant-info">
            <p>{restaurantInfo.name}</p>
            <p>{restaurantInfo.location}</p>
            <p>Product Count: {products.length}</p>
            <p>Average Rating: {restaurantInfo.averageRating}⭐️</p>
          </div>
        </div>
        <div className="dashboard-buttons">
          <div className="first-buttons">
            <button>Past Orders</button>
            <button onClick={() => {
              setEditingProduct(null);
              setShowAddProductModal(true);
            }}>Add Product ➕</button>
          </div>
          <div className="second-buttons">
            <button>Current Orders</button>
            <button>Employed Couriers</button>
          </div>
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
            <textarea placeholder="Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
            <button onClick={handleSubmitProduct}>{editingProduct ? "Save Changes" : "Add"}</button>
            {editingProduct && <button className="delete-btn" onClick={handleDeleteProduct}>Delete</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
