// components/ui/InputGroup.js

import React from 'react';

const InputGroup = ({ label, placeholder, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Icono o contenido adicional en el lado izquierdo */}
        </span>
        <input
          type="text"
          className="form-input py-2 pl-10 pr-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          placeholder={placeholder}
          onChange={onChange}
        />
        {/* Icono o contenido adicional en el lado derecho */}
      </div>
    </div>
  );
};

export default InputGroup;
