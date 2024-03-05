// Button.js
import React from 'react';

const Button = ({ type, children, onClick }) => {
  const buttonClasses = `btn-yellow text-white font-bold py-2 px-4 rounded`;

  return (
    <button className={buttonClasses} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
