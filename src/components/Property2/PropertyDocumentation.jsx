import React, { useState, useEffect } from "react";
import { usePropertyData } from "context/PropertyDataContext";
import { useS3Client } from "context/s3ClientContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FaFileAlt,
  FaFileContract,
  FaMap,
  FaPlus,
  FaUpload,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";

// Tipos de documentos requeridos
const requiredDocuments = [
  {
    id: "certificado_libertad",
    name: "Certificado de Libertad y Tradición",
    icon: FaFileAlt,
    description: "Documento que acredita la propiedad",
    color: "red",
  },
  {
    id: "escrituras_publicas",
    name: "Escrituras Públicas",
    icon: FaFileContract,
    description: "Documento notarial de la propiedad",
    color: "blue",
  },
  {
    id: "planos_catastrales",
    name: "Planos Catastrales",
    icon: FaMap,
    description: "Planos oficiales o a mano alzadadel predio",
    color: "green",
  },
];

// Tipos de documentos adicionales
const additionalDocumentTypes = [
  "Certificado de Tradición y Libertad",
  "Escritura Pública",
  "Plano Catastral",
  "Certificado de Paz y Salvo",
  "Certificado de Avalúo",
  "Certificado de Uso del Suelo",
  "Licencia de Construcción",
  "Permiso de Ocupación",
  "Certificado de Estabilidad",
  "Certificado de Servicios Públicos",
  "Certificado de No Propiedad",
  "Certificado de Antigüedad",
  "Otro",
];

export default function PropertyDocumentation({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
  currentStep,
}) {
  const { propertyData } = usePropertyData();
  const { s3Client, bucketName } = useS3Client();

  // Estados para documentos requeridos
  const [requiredDocs, setRequiredDocs] = useState({});
  
  // Estados para documentos adicionales
  const [additionalDocs, setAdditionalDocs] = useState([]);
  const [newDocType, setNewDocType] = useState("");
  const [newDocFile, setNewDocFile] = useState(null);
  const [draggedOverCard, setDraggedOverCard] = useState(null);
  const [dragCounter, setDragCounter] = useState(0);

  // Inicializar documentos requeridos
  useEffect(() => {
    const initialDocs = {};
    requiredDocuments.forEach((doc) => {
      initialDocs[doc.id] = null;
    });
    setRequiredDocs(initialDocs);
  }, []);

  const uploadFileToS3 = async (file, type, docId = null) => {
    if (!file) return null;

    try {
      const fileKey = `public/property/${
        propertyData?.propertyInfo?.id
      }/documents/${type}/${docId || 'additional'}/${Date.now()}_${file.name}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
      };

      await s3Client.send(
        new (
          await import("@aws-sdk/client-s3")
        ).PutObjectCommand(uploadParams)
      );

      const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleRequiredDocUpload = async (docId, file) => {
    if (!file) return;

    try {
      // Mostrar loading
      Swal.fire({
        title: "Subiendo documento...",
        text: "Por favor espera mientras se sube el archivo",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const fileUrl = await uploadFileToS3(file, "required", docId);
      
      setRequiredDocs(prev => ({
        ...prev,
        [docId]: {
          file: file,
          url: fileUrl,
          name: file.name,
          uploadedAt: new Date().toISOString(),
          status: 'pending_review'
        }
      }));

      setHasUnsavedChanges(true);
      
      Swal.fire({
        title: "¡Documento Subido!",
        text: "El documento ha sido subido exitosamente y está en proceso de revisión",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Error uploading required document:", error);
      Swal.fire({
        title: "Error al Subir Documento",
        text: "Hubo un problema al subir el documento. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    }
  };

  const triggerFileUpload = (docId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleRequiredDocUpload(docId, file);
      }
    };
    input.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.currentTarget) return;
    
    const docId = e.currentTarget.getAttribute('data-doc-id');
    setDragCounter(prev => {
      const newCount = prev + 1;
      if (newCount === 1) {
        setDraggedOverCard(docId);
        if (e.currentTarget && e.currentTarget.classList) {
          e.currentTarget.classList.add(
            'bg-terrasacha-primary/20', 
            'border-terrasacha-primary',
            'scale-105',
            'shadow-lg',
            'shadow-terrasacha-primary/20'
          );
        }
      }
      return newCount;
    });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.currentTarget) return;
    
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setDraggedOverCard(null);
        if (e.currentTarget && e.currentTarget.classList) {
          e.currentTarget.classList.remove(
            'bg-terrasacha-primary/20', 
            'border-terrasacha-primary',
            'scale-105',
            'shadow-lg',
            'shadow-terrasacha-primary/20'
          );
        }
      }
      return newCount;
    });
  };

  const handleDrop = (e, docId) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverCard(null);
    setDragCounter(0);
    
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.remove(
        'bg-terrasacha-primary/20', 
        'border-terrasacha-primary',
        'scale-105',
        'shadow-lg',
        'shadow-terrasacha-primary/20'
      );
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        handleRequiredDocUpload(docId, file);
      } else {
        Swal.fire({
          title: "Tipo de archivo no válido",
          text: "Solo se permiten archivos PDF, JPG, JPEG o PNG",
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#8B4513",
        });
      }
    }
  };

  const handleAdditionalDocUpload = async () => {
    if (!newDocType || !newDocFile) {
      Swal.fire({
        title: "Campos Requeridos",
        text: "Por favor selecciona un tipo de documento y sube el archivo",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    try {
      // Mostrar loading
      Swal.fire({
        title: "Subiendo documento...",
        text: "Por favor espera mientras se sube el archivo",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const fileUrl = await uploadFileToS3(newDocFile, "additional");
      
      const newDoc = {
        id: Date.now(),
        type: newDocType,
        file: newDocFile,
        url: fileUrl,
        name: newDocFile.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending_review'
      };

      setAdditionalDocs(prev => [...prev, newDoc]);
      setNewDocType("");
      setNewDocFile(null);
      setHasUnsavedChanges(true);
      
      Swal.fire({
        title: "¡Documento Agregado!",
        text: "El documento adicional ha sido subido exitosamente y está en proceso de revisión",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Error uploading additional document:", error);
      Swal.fire({
        title: "Error al Subir Documento",
        text: "Hubo un problema al subir el documento. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    }
  };

  const removeRequiredDoc = (docId) => {
    setRequiredDocs(prev => ({
      ...prev,
      [docId]: null
    }));
    setHasUnsavedChanges(true);
    toast.success("Documento eliminado");
  };

  const removeAdditionalDoc = (docId) => {
    setAdditionalDocs(prev => prev.filter(doc => doc.id !== docId));
    setHasUnsavedChanges(true);
    toast.success("Documento eliminado");
  };

  const getColorClasses = (color) => {
    const colorMap = {
      red: "bg-red-100 text-red-600 border-red-200 hover:bg-red-200",
      blue: "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200",
      green: "bg-green-100 text-green-600 border-green-200 hover:bg-green-200",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
  };

  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Documentos Requeridos */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica mb-2">
            Documentos Requeridos
          </h3>
          <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
            Sube los documentos obligatorios para la propiedad
          </p>
        </div>

        {/* Mensaje informativo */}
        <div className="bg-terrasacha-light/10 border border-terrasacha-light/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-terrasacha-primary/20 rounded-full flex items-center justify-center">
                <span className="text-terrasacha-primary text-xs sm:text-sm font-bold">
                  ℹ
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-terrasacha-primary font-typographica mb-1">
                Documentos Obligatorios
              </h4>
              <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-0">
                Los siguientes documentos son obligatorios para completar el registro de la propiedad.
                Asegúrate de subir archivos legibles y en formato PDF o imagen.
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Documentos Requeridos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {requiredDocuments.map((doc) => {
            const IconComponent = doc.icon;
            const isUploaded = requiredDocs[doc.id];
            
            return (
              <div
                key={doc.id}
                data-doc-id={doc.id}
                className={`group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 ease-in-out transform relative ${
                  isUploaded
                    ? "border-terrasacha-primary bg-terrasacha-primary/5"
                    : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 hover:scale-102 hover:shadow-md"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, doc.id)}
              >
                {/* Overlay de "Suelta aquí" cuando se arrastra */}
                {draggedOverCard === doc.id && !isUploaded && (
                  <div className="absolute inset-0 bg-terrasacha-primary/90 rounded-xl flex items-center justify-center z-10">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold font-typographica mb-2">
                        Suelta aquí
                      </h3>
                      <p className="text-sm font-typographica opacity-90">
                        Para subir {doc.name}
                      </p>
                    </div>
                  </div>
                )}

                {isUploaded ? (
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {doc.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3">
                      {isUploaded.name}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-blue-800 font-semibold font-typographica mb-0">
                        ⏳ En proceso de revisión
                      </p>
                    </div>
                    <div className="text-xs text-terrasacha-secondary1 font-typographica mb-2">
                      Subido: {new Date(isUploaded.uploadedAt).toLocaleDateString('es-ES')}
                    </div>
                    <button
                      onClick={() => removeRequiredDoc(doc.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-typographica"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div 
                    className="text-center cursor-pointer"
                    onClick={() => triggerFileUpload(doc.id)}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getColorClasses(doc.color)} rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {doc.name} <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-3">
                      {doc.description}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-red-800 font-semibold font-typographica mb-0">
                        ⚠️ Requerido
                      </p>
                    </div>
                    {/* <div className="bg-terrasacha-primary/10 border border-terrasacha-primary/30 rounded-lg p-2">
                      <p className="text-xs text-terrasacha-primary font-semibold font-typographica mb-0">
                        📁 Haz clic o arrastra archivo aquí
                      </p>
                    </div> */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Documentos Adicionales */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-terrasacha-primary font-typographica mb-2">
            Documentos Adicionales
          </h3>
          <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
            Agrega otros documentos que consideres relevantes para la propiedad
          </p>
        </div>

        {/* Formulario para agregar documento adicional */}
        <div className="bg-terrasacha-light/5 border border-terrasacha-light/20 rounded-lg p-4 sm:p-6 mb-6">
          <h4 className="text-sm sm:text-base font-semibold text-terrasacha-primary font-typographica mb-4">
            Agregar Documento Adicional
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                Tipo de Documento *
              </label>
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent font-typographica"
              >
                <option value="">Seleccionar tipo de documento</option>
                {additionalDocumentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-terrasacha-secondary1 mb-2 font-typographica">
                Archivo *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setNewDocFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-terrasacha-light rounded-lg focus:ring-2 focus:ring-terrasacha-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={handleAdditionalDocUpload}
            disabled={!newDocType || !newDocFile}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-terrasacha-primary text-white rounded-lg hover:bg-terrasacha-primary/90 transition-colors font-typographica text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUpload className="inline mr-2" />
            Subir Documento
          </button>
        </div>

        {/* Lista de documentos adicionales subidos */}
        {additionalDocs.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm sm:text-md font-semibold text-terrasacha-primary font-typographica mb-3">
              Documentos Adicionales Subidos
            </h4>
            {additionalDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 sm:p-4 border border-terrasacha-light rounded-lg bg-terrasacha-light/5"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FaFileAlt className="text-terrasacha-primary text-sm flex-shrink-0" />
                      <h5 className="text-sm sm:text-base font-semibold text-terrasacha-primary font-typographica">
                        {doc.type}
                      </h5>
                    </div>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica">
                      {doc.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                        <p className="text-xs text-blue-800 font-semibold font-typographica mb-0">
                          ⏳ En revisión
                        </p>
                      </div>
                      <p className="text-xs text-terrasacha-secondary1 font-typographica">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 self-end sm:self-auto">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica text-xs sm:text-sm"
                    >
                      Ver
                    </a>
                    <button
                      onClick={() => removeAdditionalDoc(doc.id)}
                      className="px-2 sm:px-3 py-1 text-red-500 hover:bg-red-50 rounded font-typographica text-xs sm:text-sm"
                    >
                      <FaTrash className="inline mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
