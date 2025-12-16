import React from "react";

const FormSection = ({ title, description, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl border border-terrasacha-light/20 shadow-sm p-4 sm:p-6 ${className}`}>
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;

