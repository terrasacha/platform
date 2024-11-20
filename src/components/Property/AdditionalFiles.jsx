import Card from "components/common/Card";
import { usePropertyData } from "context/PropertyDataContext";
import React, { useEffect, useState } from "react";

export default function AdditionalFiles(props) {
  const { className, autorizedUser } = props;
  const { propertyData, refresh } = usePropertyData();

  const [files, setFiles] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  console.log('files',files)

  return (
    <Card className={className}>
      <Card.Header
        title="Subir archivos adicionales"
        sep={true}
      />
      <Card.Body>
      <div className="max-w-md mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-gray-600 mb-2">Arrastra y suelta tus archivos aquí</p>
        <p className="text-sm text-gray-500">o haz clic para seleccionarlos</p>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileSelection}
        />
        <label
          htmlFor="file-upload"
          className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 cursor-pointer"
        >
          Seleccionar archivos
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-2"
            >
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 text-sm font-semibold hover:underline"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
      </Card.Body>
    </Card>
  );
}
