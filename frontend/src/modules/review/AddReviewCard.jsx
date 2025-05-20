import React from "react";
import styles from "./AddReviewCard.module.css";

const AddReviewCard = ({ onClose }) => {
  return (
  <div className={styles.reviewCardContainer}>
  <div className={styles.addReviewCard}>
          <div className={styles.addReviewHeader}>
            <div className={styles.addReviewCardX}>
              <button className={styles.addReviewCloseButton} onClick={onClose}>X</button>
            </div>

            <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Write your review</h2>

          </div>
          <textarea className={styles.reviewCardText} placeholder="Write your review here..." />
          <div className={styles.addReviewButtons}>
            <button>Submit Review</button>
            <button>Delete Review</button>
          </div>
        </div></div>

  );
};

export default AddReviewCard;
