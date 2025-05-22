import {useNavigate, useSearchParams} from "react-router-dom";
import styles from "./Product.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../modules/general/Button.jsx";

function ProductSection({ productId }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [product, setProduct] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const currentUsername = localStorage.getItem("username");
  const currentRank = localStorage.getItem("rank");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
    // fetch product info
    axios.get(`http://localhost:8080/menu/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Failed to fetch product:", err));

    // fetch user's existing review
    axios.get(`http://localhost:8080/reviews/menu/${productId}`)
      .then(res => {
        const found = res.data.find(r => r.user.username === currentUsername);
        if (found) setExistingReview(found);
      })
      .catch(err => console.error("Failed to fetch reviews:", err));

    if (currentRank === "CUSTOMER") {
      axios.get(`http://localhost:8080/favourites/get/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data !== "") setFavorite(true);
        })
        .catch(err => console.error("Failed to fetch favorite status:", err));
    }
  }, [productId]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      setTheme(localStorage.getItem("theme"));
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const elementsStar = document.getElementsByClassName("star-img");
    for (let i = 0; i < elementsStar.length; i++) {
      const element = elementsStar.item(i);
      element.src = theme === "dark" ? "/star-full.png" : "/star-full-black.png";
    }
  }, [theme]);


  const handleReviewSubmit = () => {
    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (content.length > 100) {
      alert("Reviews can be at maximum 100 characters!")
      return;
    }

    if (existingReview) {
      // Edit existing review
      axios.put(`http://localhost:8080/reviews/edit/${existingReview.id}`, null, {
        params: {
          content,
          rating
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        alert("Review updated!");
        setShowReviewModal(false);
        setContent("");
        setRating(5);
        window.location.reload();
      })
      .catch(() => alert("Failed to update review."));
    } else {
      // Create new review
      axios.post(`http://localhost:8080/reviews/create`, null, {
        params: {
          menuItemId: productId,
          content,
          rating
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        alert("Review submitted!");
        setShowReviewModal(false);
        setContent("");
        setRating(5);
        window.location.reload();
      })
      .catch(() => alert("Failed to submit review."));
    }
  };

  const addToFavorite = () => {
    axios.post(`http://localhost:8080/favourites/add/${productId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFavorite(true);
      })
      .catch(err => console.error("Failed to add to favorites:", err));
  }

  const removeFromFavorite = () => {
    axios.delete(`http://localhost:8080/favourites/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setFavorite(false);
      })
      .catch(err => console.error("Failed to remove from favorites:", err));
  }

  const handleGoToRestaurant = () => {
    navigate(`/restaurant/${product.restaurant.id}`);
  }

  const addToCart = async () => {
    if (!token) {
      alert("Please log in to add items to cart.");
      return;
    }

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
    } catch (error) {
      console.error("Could not add product to cart:", error);
    }
  };


  return (
    <div className={styles.productSection}>
      <div className={styles.productImage}>
        {product?.base64Image ? (
          <img
            src={`data:image/png;base64,${product.base64Image}`}
            alt="Menu Item"
            style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
          />
        ) : (
          "No Image"
        )}
      </div>

      <div className={styles.productDetails}>
        <div className={styles.productName}>{product?.name}</div>
        <div className={styles.productRestaurantName}>{product?.restaurantName}</div>
        <div className={styles.productRating}>{product?.rating} <img className="star-img" src="/star-full.png" alt={"⭐"} width={"2.5%"}/></div>
        <div className={styles.productDescription}>{product?.description}</div>
        <div className={styles.productPrice}>{product?.price}₺</div>

        {currentRank === "CUSTOMER" ? (
          <div className={styles.productActionButtons}>
            <button className={styles.productButton} onClick={addToCart}>Add to Cart</button>
            {favorite ? (
              <button className={styles.productButton} onClick={removeFromFavorite}>Remove Favorite</button>
            ) : (
              <button className={styles.productButton} onClick={addToFavorite}>Add Favorites</button>
            )}
            <button className={styles.productButton} onClick={handleGoToRestaurant}>Go To Restaurant</button>
            {existingReview ? (
              <>
                <button
                  className={styles.productButton}
                  onClick={() => {
                    setContent(existingReview.content);
                    setRating(existingReview.rating);
                    setShowReviewModal(true);
                  }}
                >
                  Edit Review
                </button>
                <button
                  className={styles.productButton}
                  onClick={() => {
                    axios.delete(`http://localhost:8080/reviews/delete/${existingReview.id}`, {
                      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    })
                      .then(() => window.location.reload());
                  }}
                >
                  Delete Review
                </button>
              </>
            ) : (
              <button
                className={styles.productButton}
                onClick={() => setShowReviewModal(true)}
              >
                Add Review
              </button>
            )}
          </div>
        ) : (<></>)}
      </div>
      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Write a Review</h3>
            <textarea
              placeholder="Your review"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button onClick={handleReviewSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const currentRank = localStorage.getItem("rank");

  const handleRespond = () => {
    const response = prompt("Enter your response to the review:");
    if (!response) return;
    if (response.length > 100) {
      alert("Review responses can be at maximum 100 characters!")
      return;
    }

    axios.put(`http://localhost:8080/reviews/respond/${review.id}`, null, {
      params: { response },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(() => window.location.reload())
    .catch(err => console.error("Failed to submit response:", err));
  };

  const handleReport = () => {
    const reason = prompt("Enter your reasoning for reporting the review:");
    if (!reason) return;
    if (reason.length > 100) {
      alert("Report reasons can be at maximum 100 characters!")
      return;
    }

    axios.post(`http://localhost:8080/review-disputes/create/${review.id}`, null, {
      params: {reason: reason},
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then(() => alert("Successfully reported this review. Our admins will handle this as soon as possible. Thank you for keeping our site a safe place."))
      .catch(err => console.error("Failed to submit review report:", err));
  };

  return (
    <div className={styles.productReviewCard}>
      <div className={styles.reviewHeader}>
        <p className={styles.reviewerName}>{review.user.username}</p>
        {currentRank === "RESTAURANT" && (
          <Button
            label={"Report"}
            onClick={handleReport}
            borderRadius={"10px"}
            margin={"2% auto 2% auto"}
            width={"20%"}
          />
        )}
        <p className={styles.reviewerName}>{review.rating} <img className="star-img" src="/star-full.png" alt={"⭐"} width={"35%"}/></p>
      </div>
      <div className={styles.reviewContent}>
        {review.content}
      </div>
      {review.restaurantResponse === null ? (
        currentRank === "RESTAURANT" && (
          <Button
            label={"Respond"}
            onClick={handleRespond}
            borderRadius={"10px"}
            margin={"1% auto 1% auto"}
            width={"30%"}
          />
        )
      ) : (
        <div className={styles.reviewResponseContainer}>
          Restaurant's Response:
          <div className={styles.reviewResponse}>
            {review.restaurantResponse}
          </div>
        </div>
      )}
    </div>
  );
}


function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const currentUsername = localStorage.getItem("username");
  const currentRank = localStorage.getItem("rank");


  useEffect(() => {
    axios.get(`http://localhost:8080/reviews/menu/${productId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Failed to fetch reviews:", err));
  }, [productId]);

  return (
    <div className={styles.productReviewSection}>
      <div className={styles.productReviewTitle}>Reviews</div>
      <div className={styles.productReviewOrder}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  return (
    <div className={styles.productContainer}>
      <div><ProductSection productId={productId} /></div>
      <hr className={styles.productDivider} />
      <div><ReviewSection productId={productId} /></div>
    </div>
  );
}
export default ProductDetail;