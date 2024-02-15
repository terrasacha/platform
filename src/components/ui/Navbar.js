import React from 'react';

const Navbar = ({ brand, items }) => {
  return (
    <nav className="flex items-center justify-between p-4 ">
      <div className="text-white font-bold">{brand}</div>
      <div className="flex space-x-4">
        {items && Array.isArray(items) ? (
          items.map((item, index) => (
            <a key={index} href={item.link} className="hover:text-blue-300">
              {item.label}
            </a>
          ))
        ) : (
          <span>No items provided</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
