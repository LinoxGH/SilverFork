import React from 'react';

const Button = ({ label, onClick, width, height, position, top, left, borderRadius, background}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: width,
        height: height,
        position: position,
        top: top,
        left: left,
        borderRadius: borderRadius,
        background: background,
        fontSize: "20px",
        color: "#FFFFFF"
      }}
    >
      {label ? (
        <span style={{fontSize: '20px', color: '#FFFFFF'}}>
          {label}
        </span>
      ) : null}
    </button>
  );
};

export default Button;
