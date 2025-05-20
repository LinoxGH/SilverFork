import { useSearchParams } from "react-router-dom";
import styles from "./Product.module.css";
import React, { useState } from "react";
import AddReviewCard from '../../modules/review/AddReviewCard.jsx';
import RespondReviewCard from '../../modules/review/RespondReviewCard.jsx';
import ReportReviewCard from '../../modules/review/ReportReviewCard.jsx';
function ProductSection() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className={styles.productSection}>
      <div className={styles.productImage}>Food Image</div>
      <div className={styles.productDetails}>
        <div className={styles.productName}>Food Name</div>
        <div className={styles.productRestaurantName}>Restaurant Name - Location</div>
        <div className={styles.productRating}>Rating</div>
        <div className={styles.productDescription}>Description</div>
        <div className={styles.productPrice}>Price</div>
        <div className={styles.productActionButtons}>
          <button className={styles.productButton}>Add to Cart</button>
          <div>
            <button
              className={styles.productButton}
              onClick={() => setShowPopup(true)}
            >
              Add Review
            </button>
          </div>
        </div>
      </div>
      {showPopup && <AddReviewCard onClose={() => setShowPopup(false)} />}
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

function ReviewSection() {
  const reviews = [
    {
      user: "User1",
      comment: "Really tasty and fresh!",
      reply: "Thanks for your feedback!",
    },
    {
      user: "User2",
      comment: "A bit cold when arrived.",
      reply: "We will improve delivery times!",
    },
  ];

  return (
    <div className={styles.productReviewSection}>
      <div className={styles.productReviewTitle}>Reviews</div>
      <div className={styles.productReviewOrder}>
          {reviews.map((review, idx) => (
            <div className={styles.productReviewCard}>
              <ReviewCard
                key={idx}
                user={review.user}
                comment={review.comment}
                reply={review.reply}
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