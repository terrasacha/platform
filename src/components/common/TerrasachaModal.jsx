import React from 'react';

/**
 * Componente Modal estandarizado de Terrasacha
 * Reemplaza los modales de Bootstrap con el sistema de diseño Terrasacha
 */
const TerrasachaModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  showCloseButton = true,
  footer,
  className = ""
}) => {
  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      default:
        return 'max-w-2xl';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-xl shadow-terrasacha-2xl border border-terrasacha-light/20 w-full ${getSizeClass()} max-h-[90vh] overflow-hidden animate-scale-in ${className}`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="bg-terrasacha-primary text-white px-6 py-4 flex items-center justify-between">
            {title && (
              <h2 className="text-xl font-bold font-champagne tracking-wide">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white hover:text-terrasacha-earth transition-colors duration-200 p-1"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] font-typographica">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="bg-terrasacha-light/10 px-6 py-4 border-t border-terrasacha-light/20 flex items-center justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente de botón para modales que se cierra automáticamente
 */
export const TerrasachaModalButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-terrasacha-secondary';
      case 'danger':
        return 'btn-terrasacha-danger';
      case 'outline':
        return 'btn-terrasacha-outline';
      case 'success':
        return 'btn-terrasacha-success';
      default:
        return 'btn-terrasacha-primary';
    }
  };

  return (
    <button
      className={`${getVariantClass()} text-sm ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default TerrasachaModal;
