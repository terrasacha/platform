import React from 'react';

const Infocircle = ({ text }) => {
  return (
    <div className="flex items-center bg-blue-100 border-blue-500 text-blue-500 border px-4 py-2 rounded-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 mr-2"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM11 13a1 1 0 00-1-1h-1a1 1 0 100 2h1a1 1 0 001-1zm-1-8a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {text}
    </div>
  );
};

export default Infocircle;
