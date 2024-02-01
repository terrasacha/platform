// Alert.js
import React from 'react';

const Alert = ({ type, children }) => {
  const alertClasses = `alert-${type} p-4 border-l-4`;
  
  return (
    <div className={alertClasses} role="alert">
      {children}
    </div>
  );
};

export default Alert;
