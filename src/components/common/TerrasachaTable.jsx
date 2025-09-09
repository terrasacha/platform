import React from 'react';

/**
 * Componente de tabla estandarizado de Terrasacha
 * Utiliza el sistema de diseño definido en tailwind.config.js
 */
const TerrasachaTable = ({ 
  title, 
  subtitle, 
  headers, 
  data, 
  renderRow, 
  className = "",
  showHeader = true 
}) => {
  return (
    <div className={`table-terrasacha-container ${className}`}>
      {showHeader && (title || subtitle) && (
        <div className="table-terrasacha-header-section">
          {title && (
            <h3 className="table-terrasacha-title">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="table-terrasacha-subtitle">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="table-terrasacha">
          <thead className="table-terrasacha-thead">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="table-terrasacha-th">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-terrasacha-tbody">
            {data.map((item, index) => (
              <tr key={item.id || index} className="table-terrasacha-tr">
                {renderRow(item, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Componente de celda estandarizado
 */
export const TerrasachaTableCell = ({ 
  children, 
  variant = 'default',
  className = "" 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'table-terrasacha-td-primary';
      case 'secondary':
        return 'table-terrasacha-td-secondary';
      default:
        return 'table-terrasacha-td';
    }
  };

  return (
    <td className={`${getVariantClass()} ${className}`}>
      {children}
    </td>
  );
};

/**
 * Componente de badge estandarizado para tablas
 */
export const TerrasachaBadge = ({ 
  children, 
  variant = 'neutral',
  className = "" 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'table-terrasacha-badge table-terrasacha-badge-success';
      case 'warning':
        return 'table-terrasacha-badge table-terrasacha-badge-warning';
      case 'info':
        return 'table-terrasacha-badge table-terrasacha-badge-info';
      case 'secondary':
        return 'table-terrasacha-badge table-terrasacha-badge-secondary';
      case 'danger':
        return 'table-terrasacha-badge table-terrasacha-badge-danger';
      default:
        return 'table-terrasacha-badge table-terrasacha-badge-neutral';
    }
  };

  return (
    <span className={`${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
};

export default TerrasachaTable;
