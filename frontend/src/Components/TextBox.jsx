import React from 'react';

const TextBox = ({ 
  placeholder, 
  fontSize = '24px', 
  fontFamily = 'Arial', 
  backgroundColor = '#727272', 
  textColor = '#FFFFFF',
  width, 
  height, 
  position = 'absolute', 
  top, 
  left,
  value, 
  onChange
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        fontSize: fontSize,
        fontFamily: fontFamily,
        backgroundColor: backgroundColor,
        color: textColor,
        width: width,
        height: height,
        position: position,
        top: top,
        left: left,
      }}
    />
  );
};

export default TextBox;

