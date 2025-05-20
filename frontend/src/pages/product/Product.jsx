import { useSearchParams } from "react-router-dom";
import styles from "./Product.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductSection({ productId }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/menu/${productId}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Failed to fetch product:", err));
  }, [productId]);

  const handleReviewSubmit = () => {
    axios.post(`http://localhost:8080/reviews/create`, null, {
      params: {
        menuItemId: productId,
        content,
        rating
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(() => {
      alert("Review submitted!");
      setShowReviewModal(false);
      setContent("");
      setRating(5);
    })
    .catch(() => alert("Failed to submit review."));
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
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
        <div className={styles.productrating}>{product?.rating} ⭐</div>
        <div className={styles.productDescription}>{product?.description}</div>
        <div className={styles.productPrice}>{product?.price}₺</div>

        <div className={styles.productActionButtons}>
          <button className={styles.productButton} onClick={addToCart}>Add to Cart</button>
          <button
            className={styles.productButton}
            onClick={() => setShowReviewModal(true)}
          >
            Add Review
          </button>
        </div>
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

function ReviewCard({ user, comment, reply }) {
  return (
    <div className={styles.productReviewOrder}>
      <strong>{user}</strong>
      <hr />
      <p>{comment}</p>
      <hr />
      <p><em>{reply}</em></p>
    </div>
  );
}

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);

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
          <div key={review.id} className={styles.productReviewCard}>
            <ReviewCard
              user={review.user.username}
              comment={review.content}
              reply={review.restaurantResponse}
            />
          </div>
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