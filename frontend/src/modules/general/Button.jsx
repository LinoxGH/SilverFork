import React from 'react';
import styles from "./Button.module.css";

const Button = ({ label, onClick, width, height, margin, position, top, left, borderRadius, useLighter = false, fontSize = 20}) => {
  return (
    <button
      onClick={onClick}
      className={useLighter ? styles.buttonLighter : styles.button}
      style={{
        width: width,
        height: height,
        margin: margin,
        position: position,
        top: top,
        left: left,
        borderRadius: borderRadius,
        fontSize: fontSize + "px"
      }}
    >
      {label ? (
        <span className={styles.label} style={{fontSize: fontSize + 'px'}}>
          {label}
        </span>
      ) : null}
    </button>
  );
};

export default Button;
