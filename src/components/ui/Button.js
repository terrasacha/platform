// Button.js
import React from 'react';

const Button = ({ type, children, onClick }) => {
  const buttonClasses = `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`;

  return (
    <button className={buttonClasses} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
