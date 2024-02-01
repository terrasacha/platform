import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 bg-white p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
