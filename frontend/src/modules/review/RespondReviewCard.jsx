import React from "react";
import styles from "./RespondReviewCard.module.css";

const RespondReviewCard = ({ onClose }) => {
  return (
  <div className={styles.respondReviewCardContainer}>
  <div className={styles.respondReviewCard}>
          <div className={styles.respondReviewHeader}>
            <div className={styles.respondReviewCardX}>
              <button className={styles.respondReviewCloseButton} onClick={onClose}>X</button>
            </div>

            <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Respond Text</h2>

          </div>
          <textarea className={styles.respondedReviewCardText} placeholder="Review to be responded" />
          <textarea className={styles.respondReviewCardText} placeholder="Write your respond here..." />
          <div className={styles.respondReviewButtons}>
            <button>Submit Respond</button>
            <button>Delete Respond</button>
          </div>
        </div></div>

  );
};

export default RespondReviewCard;
