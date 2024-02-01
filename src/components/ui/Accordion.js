import React, { useState } from 'react';

const Accordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <div
            onClick={() => handleClick(index)}
            className={`flex justify-between items-center p-4 cursor-pointer border-b ${
              activeIndex === index ? 'bg-blue-100' : 'bg-white'
            }`}
          >
            <span>{item.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-4 h-4 ${activeIndex === index ? 'transform rotate-180' : ''}`}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 13a1 1 0 00-1-1H6a1 1 0 100 2h3a1 1 0 001-1zM10 11a1 1 0 100-2 1 1 0 000 2zm-4-4a1 1 0 100-2 1 1 0 000 2zM10 5a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {activeIndex === index && <div className="p-4">{item.content}</div>}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
