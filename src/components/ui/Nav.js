import React from 'react';

const Nav = ({ items }) => {
  return (
    <nav className="flex space-x-4">
      {items.map((item, index) => (
        <a key={index} href={item.link} className="text-blue-500 hover:text-blue-700">
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default Nav;
