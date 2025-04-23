import styles from "./Product.module.css";
import NavBar from "../../modules/navbar/NavBar.jsx";



function ProductSection() {
  return (
    <div className={styles["product-section"]}>
      <div className={styles["product-image"]}>Food Image</div>
      <div className={styles["product-details"]}>
        <div className={styles["product-name"]}>Food Name</div>
        <div className={styles["restaurant-name"]}>Restaurant Name - Location</div>
        <div className={styles["rating"]}>Rating</div>
        <div className={styles["description"]}>Description</div>
        <div className={styles["price"]}>Price</div>
        <div className={styles["action-buttons"]}>
          <button className={styles["login-button"]}>Add to Cart</button>
          <button className={styles["login-button"]}>Add Review</button>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ user, comment, reply }) {
  return (
    <div className={styles["review-card"]}>
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
    <div className={styles["review-section"]}>
      <div className={styles["reviews-title"]}>Reviews</div>
      <div className={styles["review-cards"]}>
        {reviews.map((review, idx) => (
          <ReviewCard
            key={idx}
            user={review.user}
            comment={review.comment}
            reply={review.reply}
          />
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  return (
    <><NavBar />
    <div><ProductSection /></div>
    <hr className="divider" />
    <div><ReviewSection /></div></>
      
  );
}
export default ProductDetail;