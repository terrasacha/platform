import React from 'react';

const Badge = ({ children, variant }) => {
  const badgeClasses = `category_label inline-block px-2 py-1 text-xs font-semibold leading-none rounded-full ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`;

  return <span className={badgeClasses}>{children}</span>;
};

export default Badge;
