import React from 'react';

const Button = ({ label, onClick, width, height, margin, position, top, left, borderRadius, background, fontSize = 20, color = "#FFFFFF"}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: width,
        height: height,
        margin: margin,
        position: position,
        top: top,
        left: left,
        borderRadius: borderRadius,
        background: background,
        fontSize: fontSize + "px",
        color: color
      }}
    >
      {label ? (
        <span style={{fontSize: fontSize + 'px', color: color}}>
          {label}
        </span>
      ) : null}
    </button>
  );
};

export default Button;
