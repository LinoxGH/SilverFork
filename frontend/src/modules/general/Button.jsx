import React from 'react';

const Button = ({ label, onClick, width, height, position, top, left}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: width,
        height: height,
        position: position,
        top: top,
        left: left,
      }}
    >
      <span style={{fontSize: '24px', color: '#FFFFFF'}}>
        {label}
      </span>
    </button>
  );
};

export default Button;
