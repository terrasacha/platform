import React, { useState } from 'react';

const Offcanvas = ({ isOpen, onClose, children }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        ></div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offcanvas;
