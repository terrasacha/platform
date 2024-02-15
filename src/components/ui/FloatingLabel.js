// components/ui/FloatingLabel.js

import React from 'react';

const FloatingLabel = ({ label, placeholder, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 relative">
      <input
        type="text"
        className="form-input py-2 pl-3 pr-1 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
      <label
        className="absolute left-3 -top-2 px-1 text-xs text-gray-500 bg-white"
        style={{ transition: 'top 0.1s, font-size 0.1s', top: value || placeholder ? '-2px' : '50%', fontSize: value || placeholder ? '75%' : '100%' }}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabel;
