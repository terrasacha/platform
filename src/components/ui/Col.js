// Col.js
import React from 'react';

const Col = ({ children, size }) => {
  const colClasses = `col-${size}`;

  return <div className={colClasses}>{children}</div>;
};

export default Col;
