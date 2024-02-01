import React, { useState } from 'react';

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button onClick={handleToggle} className="bg-gray-300 p-2 rounded">
        {title}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg">
          <ul>
            {items.map((item, index) => (
              <li key={index} className="p-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
