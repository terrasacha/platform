import React from 'react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex space-x-4">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.link} className="text-blue-500 hover:text-blue-700">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
