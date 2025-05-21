import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RestaurantDashboard.css";
import ProductCard from "../../modules/product/ProductCard.jsx";
import ProductFilters from "../../modules/product/ProductFilter.jsx";
import Button from "../../modules/general/Button.jsx";

const RestaurantDashboard = () => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Sample Restaurant",
    location: "123 Sample Street",
    picture: null,
    productCount: 3,
    averageRating: 4.5,
    minCartPrice: 20.0
  });

  // Sorting and Filtering
  const [sortOption, setSortOption] = useState("none");
  const [minPriceInput, setMinPriceInput] = useState(restaurantInfo.minCartPrice);
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  // Add/Edit/Delete Product
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Products List
  const [products, setProducts] = useState([]);
  const [rawProducts, setRawProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/restaurant/menu", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRawProducts(res.data);
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to fetch products:", err));

    axios.get(`http://localhost:8080/restaurant/menu/info`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        restaurantInfo.name = res.data.name;
        restaurantInfo.minCartPrice = res.data.minimumCart;
        restaurantInfo.picture = res.data.picture;

        setMinPriceInput(restaurantInfo.minCartPrice);
      })
      .catch(err => console.error("Failed to fetch restaurant info:", err));

    axios.get(`http://localhost:8080/restaurant/menu/address`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        restaurantInfo.location = res.data.details;
      })
      .catch(err => console.error("Failed to fetch restaurant address:", err));
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductPrice(editingProduct.price);
      setProductDescription(editingProduct.description || "");
      setProductImage(editingProduct.picture || null);
      setImagePreview(editingProduct.picture || null)
    } else {
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImage(null);
      setImagePreview(null)
    }

    const nameField = document.getElementById("product-name-field");
    if (nameField) nameField.value = productName;
    const priceField = document.getElementById("product-price-field");
    if (priceField) priceField.value = productPrice;
    const descField = document.getElementById("product-desc-field");
    if (descField) descField.value = productDescription;
    const imgField = document.getElementById("modal-image");
    if (imgField) imgField.src = imagePreview;
  }, [editingProduct]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
  };

  const handleMinimumCart = async () => {
    const token = localStorage.getItem("token");

    axios.put(`http://localhost:8080/restaurant/menu/min-cart/${minPriceInput}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file); // Gerçek dosya
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProduct = async () => {
    const token = localStorage.getItem("token");

    const productData = {
      name: productName,
      price: Number(productPrice),
      description: productDescription,
      picture: null,
      category: null,
      cuisine: null
    };

    const formData = new FormData();
    formData.append("newPicture", productImage);

    try {
      let productId;
      if (editingProduct) {
        await axios.put(`http://localhost:8080/restaurant/menu/update/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        productId = editingProduct.id;
      } else {
        const res = await axios.post("http://localhost:8080/restaurant/menu/add", productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        productId = res.data.id;
      }

      await axios.put(`http://localhost:8080/restaurant/menu/picture/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const res = await axios.get("http://localhost:8080/restaurant/menu", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
      setRawProducts(res.data);

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
      setRawProducts(res.data);

      setEditingProduct(null);
      setShowAddProductModal(false);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Could not delete product.");
    }
  };

  const sortProducts = (option) => {
    setSortOption(option);
    let sorted = [...rawProducts];
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
    const filtered = rawProducts.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    setProducts(filtered);
  };

  return (
    <div className="dashboard-container">
      <div className="restaurant-header">
        <div className="restaurant-main">
          <div className="restaurant-logo">
            <img src={"data:image/jpeg;base64," + restaurantInfo.picture} alt={"Restaurant Logo"} className="restaurant-logo-img"/>
          </div>
          <div className="restaurant-info">
            <p>{restaurantInfo.name}</p>
            <p>{restaurantInfo.location}</p>
            <p>Product Count: {products.length}</p>
            <p>Average Rating: {restaurantInfo.averageRating}⭐️</p>
          </div>
        </div>
        <div className="dashboard-buttons">
          <div className="buttons">
            <Button
              label={"Add Product +"}
              onClick={() => {
                setEditingProduct(null);
                setShowAddProductModal(true);
              }}
              borderRadius={"10px"}
              width={"100%"}
            />
            <Button
              label={"Current Orders"}
              onClick={() => navigate("/current-orders")}
              borderRadius={"10px"}
              width={"100%"}
            />
          </div>
        </div>
      </div>

      <hr className="divider" />

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
        <div>
          <div className="min-price">
            <label>Minimum Cart Price:   </label>
            <input
              type="number"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={handleMinimumCart}
            />$
          </div>
          <h3 className="product-label">Products</h3>
          <div className="products">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                restaurantName={restaurantInfo.name}
                handleEdit={handleEditProduct}
                isFavoritable={false}
                isOrderable={false}
              />
            ))}
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

            <div className="modal-image-container">
              {imagePreview ? (
                <img className="modal-image" src={imagePreview} alt="Product Image" />
              ) : (
                <div className="modal-placeholder-container">
                  <span className="modal-placeholder-text">Upload Image</span>
                </div>
              )}
              <div className="modal-file-input">
                <input
                  id="modal-file-input-id"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="modal-file-input-button"
                />
              </div>
            </div>

            <input id="product-name-field" type="text" placeholder="Food Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input id="product-price-field" type="number" placeholder="Food Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
            <textarea id="product-desc-field" placeholder="Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
            <button onClick={handleSubmitProduct}>{editingProduct ? "Save Changes" : "Add"}</button>
            {editingProduct && <button className="delete-btn" onClick={handleDeleteProduct}>Delete</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
