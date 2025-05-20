import React from "react";
import styles from "./ReportReviewCard.module.css";

const ReportReviewCard = ({ onClose }) => {
  return (
  <div className={styles.reportReviewCardContainer}>
  <div className={styles.reportReviewCard}>
          <div className={styles.reportReviewHeader}>
            <div className={styles.reportReviewCardX}>
              <button className={styles.reportReviewCloseButton} onClick={onClose}>X</button>
            </div>

            <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Report Text</h2>

          </div>
          <textarea className={styles.reportedReviewCardText} placeholder="Review to be reported" />
          <textarea className={styles.reportReviewCardText} placeholder="Write your report here..." />
          <div className={styles.reportReviewButtons}>
            <button>Submit Report</button>
            <button>Delete Report</button>
          </div>
        </div></div>

  );
};

export default ReportReviewCard;
