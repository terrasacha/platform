import React from 'react';

const Stack = ({ direction, spacing, children }) => {
  const stackClasses = `flex ${direction === 'vertical' ? 'flex-col' : 'flex-row'} space-${spacing}`;

  return <div className={stackClasses} >{children}</div>;
};

export default Stack;
