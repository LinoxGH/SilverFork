import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, restaurantName, onButtonClick, buttonLabel }) => {
  return (
    <div className="product-card" key={product.id}>
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
