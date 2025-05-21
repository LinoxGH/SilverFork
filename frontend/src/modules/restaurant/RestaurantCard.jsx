import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RestaurantCard.module.css";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const imagePreview = restaurant.picture ? `data:image/jpeg;base64,${restaurant.picture}` : null;

  const goToRestaurantPage = () => {
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div className={styles.restaurantCard}>
      <div className={styles.restaurantImg} onClick={goToRestaurantPage} style={{ cursor: "pointer" }}>
        {imagePreview ? (
          <img src={imagePreview} alt="Restaurant Image"/>
        ) : (
          <p>Restaurant Image</p>
        )}
      </div>

      <div className={styles.restaurantInfo}>
        <p className={styles.restaurantName}>{restaurant.name}</p>
        <p className={styles.restaurantRating}>{restaurant.rating} ⭐</p>
      </div>
    </div>
  );
};

export default RestaurantCard;