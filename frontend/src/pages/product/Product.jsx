import styles from "./Product.module.css";
import NavBar from "../../modules/navbar/NavBar.jsx";



function ProductSection() {
  return (
    <div className={styles.productSection}>
      <div className={styles.productImage}>Food Image</div>
      <div className={styles.productDetails}>
        <div className={styles.productName}>Food Name</div>
        <div className={styles.productRestaurantName}>Restaurant Name - Location</div>
        <div className={styles.productrating}>Rating</div>
        <div className={styles.productDescription}>Description</div>
        <div className={styles.productPrice}>Price</div>
        <div className={styles.productActionButtons}>
          <button className={styles.productButton}>Add to Cart</button>
          <button className={styles.productButton}>Add Review</button>
        </div>
      </div>
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
  return (
    <div className={styles.productContainer}>
      <div><ProductSection /></div>
      <hr className={styles.productDivider} />
      <div><ReviewSection /></div>
    </div>
    
      
  );
}
export default ProductDetail;