import React from 'react';

const Checkbox = ({
    checked,
    onChange,
    top,
    left,
    width,
    height,
    position = 'absolute'
}) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
            width: width,
            height: height,
            position: position,
            top: top,
            left: left,
          }}
      />
    </div>
  );
};

export default Checkbox;
