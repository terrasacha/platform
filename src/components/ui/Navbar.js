import React from 'react';

const Navbar = ({ brand, items }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-blue-500 text-white">
      <div className="text-white font-bold">{brand}</div>
      <div className="flex space-x-4">
        {items.map((item, index) => (
          <a key={index} href={item.link} className="hover:text-blue-300">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
