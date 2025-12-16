import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const DynamicList = ({ 
  title, 
  items, 
  onAdd, 
  onRemove, 
  renderItem,
  emptyMessage = "No hay elementos agregados",
  addButtonText = "Agregar"
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-terrasacha-primary font-typographica">
          {title}
        </h4>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center space-x-2 px-3 py-1.5 bg-[#6e6c35] hover:bg-[#849b50] text-white rounded text-xs font-typographica transition-colors"
        >
          <FaPlus className="w-3 h-3" />
          <span>{addButtonText}</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 font-typographica">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="Eliminar"
              >
                <FaTrash className="w-4 h-4" />
              </button>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicList;

