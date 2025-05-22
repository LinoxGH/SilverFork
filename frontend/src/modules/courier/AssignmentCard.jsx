import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AssignmentCard.module.css";
import Button from "../general/Button.jsx";

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();

  console.log(assignment);

  const imagePreview = assignment.items[0].picture ? `data:image/jpeg;base64,${assignment.items[0].picture}` : null;

  function markAsDelivered() {

  }

  return (
    <div className={styles.assignmentCard}>
      <div className={styles.leftPanel}>
        <div className={styles.imageContainer}>
          <img src={imagePreview} alt={"Food Image"} className={styles.image}/>
        </div>
        <div className={styles.detailsContainer}>
          <p><strong>Order No:</strong> {assignment.id}</p>
          <p><strong>Date:</strong> {assignment.orderDate}</p>
          <Button
            label={"Mark as Delivered"}
            onClick={markAsDelivered}
            width={"70%"}
            borderRadius={"10px"}
            fontSize={16}
            margin={"auto 0 0 0"}
          />
        </div>
      </div>
      <div className={styles.rightPanel}>
        <strong className={styles.addressTitle}>Address Details</strong>
        <p className={styles.addressDetails}>{assignment.address.details}</p>
      </div>
    </div>
  );
};

export default AssignmentCard;