import React, { useState, useRef, useEffect } from 'react';

export default function DropDownProjects({ style, className, variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Array of dropdown items - can be expanded in the future
  const dropdownItems = [
    {
      href: process.env.REACT_APP_ENV === 'TEST' ? 'https://internal-marketplace.terrasacha.com/' : 'https://marketplace.terrasacha.com/',
      label: 'Terrasacha marketplace',
      isExternal: true
    }
    // Add more items here as needed
  ];

  const hasMultipleItems = dropdownItems.length > 1;

  return (
    <div className="relative" ref={dropdownRef} style={style}>
      <button
        onClick={toggleDropdown}
        className={`${className} inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-terrasacha-primary focus:ring-opacity-20`}
        type="button"
      >
        Ver Proyectos
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-terrasacha-xl border border-terrasacha-light z-50 animate-fade-in">
          <div className="py-1">
            {dropdownItems.map((item, index) => (
              <React.Fragment key={index}>
                <a
                  href={item.href}
                  className="block px-4 py-3 text-sm text-terrasacha-secondary1 hover:bg-terrasacha-earth hover:text-terrasacha-primary transition-all duration-300 font-bold"
                  onClick={() => setIsOpen(false)}
                  {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {item.label}
                </a>
                {/* Only show hr if there are multiple items and this is not the last item */}
                {hasMultipleItems && index < dropdownItems.length - 1 && (
                  <hr className="border-terrasacha-light my-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
