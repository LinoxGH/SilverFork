import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, restaurantName, handleEdit, isFavoritable, isOrderable, onRefresh }) => {
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const goToProductPage = () => {
    navigate(`/product?id=${product.id}`);
  };

  const toggleHeart = async () => {
    try {
      if (!favorite) {
        await axios.post(
          `http://localhost:8080/favourites/add/${product.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:8080/favourites/remove/${product.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
    setFavorite(!favorite);
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/customer/cart/add",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            menuItemId: product.id,
            quantity: 1
          }
        }
      );
      console.log("Added product to cart:", response.data);
    } catch (error) {
      console.error("Could not add product to cart:", error);
    }
  };

  return (
    <div className="product-card">
      {isFavoritable && (
        <button className="heart-btn" onClick={toggleHeart}>
          {favorite ? "❤️" : "🤍"}
        </button>
      )}

      <div className="product-img" onClick={goToProductPage} style={{ cursor: "pointer" }}>
        Food Img
      </div>

      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-place">{restaurantName}</p>
        <p className="product-rating">{product.description}</p>
        <p className="product-price">
          {product.price}$
          {isOrderable ? (
            <>
              <button className="push-btn" onClick={addToCart}>
                <img src="/plus.png" alt={"+"} width={"5%"}/>
              </button>
            </>
          ) : (handleEdit ? (
            <>
              <button className="push-btn" onClick={handleEdit}>
                <img src="/pen.png" alt={"✎"} width={"5%"}/>
              </button>
            </>
          ) : null)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;