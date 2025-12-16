import React from "react";

const FormField = ({ 
  label, 
  name, 
  error, 
  required = false, 
  children,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label 
        htmlFor={name} 
        className="text-sm font-semibold text-terrasacha-primary font-typographica"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 font-typographica mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;

