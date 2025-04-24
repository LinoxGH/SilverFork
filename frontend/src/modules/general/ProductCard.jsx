import React, { useState } from "react";
import "./ProductCard.css";

const ProductCard = ({ product, restaurantName, onButtonClick, buttonLabel, showHeart = true }) => {
  const [liked, setLiked] = useState(false);

  const token = localStorage.getItem("token");

  const toggleHeart = async () => {
    setLiked(!liked);
    try {
      if (!liked) {
        await axios.post(
          `http://localhost:8080/favorites/add/${product.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:8080/favorites/remove/${product.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <div className="product-card">
      {showHeart && (
        <button className="heart-btn" onClick={toggleHeart}>
          {liked ? "❤️" : "🤍"}
        </button>
      )}
      <div className="product-img">Food Img</div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-place">{restaurantName}</p>
        <p className="product-rating">{product.description}</p>
        <p className="product-price">
          {product.price}$
          <button className="push-btn" onClick={() => onButtonClick(product)}>
            {buttonLabel}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;