import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaTimes, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { API, graphqlOperation } from "aws-amplify";
import { updateDocument } from "graphql/mutations";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "context/AuthContext";
// Estilos para capas de texto y anotaciones del PDF
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import CertificadoLibertadTradicionForm from "./forms/CertificadoLibertadTradicion/CertificadoLibertadTradicionForm";
import PlanosCatastralesForm from "./forms/PlanosCatastrales/PlanosCatastralesForm";
import EscriturasPublicasForm from "./forms/EscriturasPublicas/EscriturasPublicasForm";

// Configurar el worker de PDF.js usando unpkg (forma recomendada por react-pdf para setups sin config personalizada)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentViewerModal = ({ 
  isOpen, 
  onClose, 
  documentUrl, 
  documentName,
  documentId,
  documentType,
  propertyData,
  refreshPropertyData
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImage, setIsImage] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const { user } = useAuth();

  // Verificar si el usuario tiene rol permitido (legal, administrador o consultor)
  const isAuthorizedUser = user?.role === "legal" || user?.role === "admon" || user?.role === "validator";

  // Determinar si se debe mostrar el panel del formulario (solo para usuarios autorizados y estos tipos de documentos)
  const showFormPanel = isAuthorizedUser && (documentType === "CERTIFICADO_TRADICION" || documentType === "PLANO_CATASTRAL" || documentType === "ESCRITURA_PUBLICA") && documentId;
  
  // Determinar qué formulario mostrar
  const showForm = showFormPanel;
  const isCertificadoForm = documentType === "CERTIFICADO_TRADICION";
  const isPlanosForm = documentType === "PLANO_CATASTRAL";
  const isEscriturasForm = documentType === "ESCRITURA_PUBLICA";

  // Detectar si es una imagen
  useEffect(() => {
    if (!documentUrl) return;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const urlLower = documentUrl.toLowerCase();
    const isImageFile = imageExtensions.some(ext => urlLower.includes(ext));
    setIsImage(isImageFile);
  }, [documentUrl]);

  // Cargar datos del formulario desde el documento
  useEffect(() => {
    const loadFormData = async () => {
      if (!isOpen || !showForm || !documentId || !propertyData) {
        setFormData(null);
        return;
      }

      setIsLoadingForm(true);
      try {
        // Buscar el documento en propertyData
        const globalFeature = propertyData?.propertyFeatures?.find(
          (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
        );
        
        const document = globalFeature?.documents?.items?.find(
          (doc) => doc.id === documentId
        );

        if (document) {
          let data = {};
          try {
            data = JSON.parse(document.data || '{}');
          } catch {
            data = {};
          }

          // Extraer datos del formulario si existen
          if (data.formData) {
            setFormData(data.formData);
          } else {
            setFormData(null);
          }
        } else {
          setFormData(null);
        }
      } catch (err) {
        console.error("Error cargando datos del formulario:", err);
        setFormData(null);
      } finally {
        setIsLoadingForm(false);
      }
    };

    loadFormData();
  }, [isOpen, showForm, documentId, propertyData]);

  // Resetear estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
      setLoading(true);
      setError(null);
      setNumPages(null);
    }
  }, [isOpen, documentUrl]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("Error al cargar el documento. Por favor, intenta descargarlo.");
    setLoading(false);
  };

  const handlePreviousPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(3.0, prev + 0.25));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Pantalla completa deshabilitada a petición: solo controles de zoom y navegación

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft" && !isImage && numPages) {
      handlePreviousPage();
    } else if (e.key === "ArrowRight" && !isImage && numPages) {
      handleNextPage();
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      handleZoomIn();
    } else if (e.key === "-") {
      e.preventDefault();
      handleZoomOut();
    } else if (e.key.toLowerCase() === "r" && !isImage) {
      e.preventDefault();
      handleRotateRight();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, pageNumber, numPages, isImage]);

  // Función para guardar los datos del formulario
  const handleFormSubmit = async (formData) => {
    if (!documentId) {
      toast.error("No se pudo identificar el documento");
      return;
    }

    setIsSavingForm(true);
    try {
      // Buscar el documento actual para obtener sus datos
      const globalFeature = propertyData?.propertyFeatures?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
      );
      
      const document = globalFeature?.documents?.items?.find(
        (doc) => doc.id === documentId
      );

      if (!document) {
        toast.error("No se encontró el documento");
        return;
      }

      // Parsear datos existentes
      let existingData = {};
      try {
        existingData = JSON.parse(document.data || '{}');
      } catch {
        existingData = {};
      }

      // Actualizar con los datos del formulario
      const updatedData = {
        ...existingData,
        formData: formData,
      };

      // Actualizar el documento en la base de datos
      const input = {
        id: documentId,
        data: JSON.stringify(updatedData),
      };

      await API.graphql(graphqlOperation(updateDocument, { input }));

      toast.success("Información guardada exitosamente");
      
      // Refrescar los datos del predio
      if (refreshPropertyData) {
        await refreshPropertyData();
      }

      // Actualizar el estado local
      setFormData(formData);
    } catch (err) {
      console.error("Error guardando datos del formulario:", err);
      Swal.fire({
        title: "Error al Guardar",
        text: "No se pudo guardar la información. Por favor intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
    } finally {
      setIsSavingForm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-document-viewer-modal
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`bg-white rounded-xl shadow-2xl w-full ${showForm ? 'max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1600px]' : 'max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-6xl'} max-h-[95vh] flex flex-col`}>
        {/* Header */}
        <div className="bg-[#6e6c35] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold font-typographica truncate">
              {documentName || "Visualizador de Documento"}
            </h2>
            {!isImage && numPages && !showForm && (
              <span className="text-xs sm:text-sm opacity-90 font-typographica whitespace-nowrap hidden sm:inline">
                (Página {pageNumber} de {numPages})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded transition-colors"
              aria-label="Cerrar"
              title="Cerrar (ESC)"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Body - Contenedor principal con layout condicional */}
        <div className={`flex-1 overflow-hidden flex ${showFormPanel ? 'flex-col xl:flex-row' : 'flex-col'}`}>
          {/* Visualizador de documento */}
          <div className={`${showFormPanel ? 'w-full xl:w-1/2 xl:border-r border-gray-300' : 'w-full'} flex flex-col overflow-hidden bg-gray-100 relative`}>
            {/* Controles de navegación para PDFs (dentro del visualizador cuando hay formulario) */}
            {showFormPanel && !isImage && numPages && numPages > 1 && (
              <div className="bg-[#849b50] text-white px-4 py-2 flex items-center justify-between flex-shrink-0 border-b border-[#6e6c35] relative z-10">
                <button
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-typographica"
                  aria-label="Página anterior"
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-typographica hidden sm:inline">Página</span>
                  <input
                    type="number"
                    min="1"
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= numPages) {
                        setPageNumber(page);
                      }
                    }}
                    className="w-12 sm:w-16 px-2 py-1 text-center bg-white/20 border border-white/30 rounded text-white text-xs sm:text-sm font-typographica focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <span className="text-xs sm:text-sm font-typographica">de {numPages}</span>
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={pageNumber >= numPages}
                  className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-typographica"
                  aria-label="Página siguiente"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Controles de zoom flotantes (solo para PDFs) */}
            {!isImage && (
              <div className={`absolute ${showFormPanel && numPages && numPages > 1 ? 'top-14' : 'top-4'} right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 flex items-center space-x-1 px-2 py-1.5`}>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Alejar"
                  title="Alejar (-)"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <span className="text-xs sm:text-sm font-typographica min-w-[2.5rem] text-center text-gray-700 font-semibold">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Acercar"
                  title="Acercar (+)"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
                <div className="w-px h-5 bg-gray-200 mx-1" />
                <button
                  onClick={handleRotateLeft}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Rotar a la izquierda"
                  title="Rotar 90° a la izquierda"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* Flecha curvada hacia la izquierda */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5H9m0 0l2.5-2.5M9 5l2.5 2.5M19 13a7 7 0 00-7-7H9"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleRotateRight}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Rotar a la derecha"
                  title="Rotar 90° a la derecha (tecla R)"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* Flecha curvada hacia la derecha */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5h6m0 0L12.5 2.5M15 5l-2.5 2.5M5 13a7 7 0 017-7h3"
                    />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Área de visualización */}
            <div
              className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 flex items-center justify-center"
              onWheel={(e) => {
                // Evita que el scroll se propague al fondo
                e.stopPropagation();
              }}
            >
          {loading && isImage && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaSpinner className="w-8 h-8 text-[#6e6c35] animate-spin" />
              <p className="text-[#6e6c35] font-typographica">Cargando documento...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-typographica mb-0">{error}</p>
              </div>
            </div>
          )}

          {!error && isImage && (
            <div className="max-w-full max-h-full flex items-center justify-center w-full h-full">
              <img
                src={documentUrl}
                alt={documentName || "Documento"}
                className={`max-w-full max-h-full object-contain rounded-lg shadow-lg ${showForm ? 'max-h-[calc(95vh-180px)]' : 'max-h-[calc(95vh-250px)]'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError("Error al cargar la imagen.");
                  setLoading(false);
                }}
              />
            </div>
          )}

          {!error && !isImage && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-2">
                <Document
                  file={documentUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex flex-col items-center justify-center space-y-4 p-8">
                      <FaSpinner className="w-8 h-8 text-[#6e6c35] animate-spin" />
                      <p className="text-[#6e6c35] font-typographica">Cargando PDF...</p>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center space-y-4 p-8">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-typographica mb-0">
                          No se pudo cargar el PDF para visualización.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-lg"
                  />
                </Document>
              </div>
            </div>
          )}
            </div>
          </div>

          {/* Formulario (solo para CERTIFICADO_TRADICION, PLANO_CATASTRAL o ESCRITURA_PUBLICA) */}
          {showFormPanel && (
            <div className="w-full xl:w-1/2 flex flex-col overflow-hidden bg-white border-t xl:border-t-0 xl:border-l border-gray-300">
              {/* Header del formulario */}
              <div className="bg-[#849b50] text-white px-4 sm:px-6 py-3 flex-shrink-0 border-b border-[#6e6c35]">
                <h3 className="text-base sm:text-lg font-bold font-typographica">
                  {isCertificadoForm 
                    ? "Información del Certificado" 
                    : isPlanosForm 
                    ? "Información de Planos Catastrales"
                    : "Información de Escrituras Públicas"
                  }
                </h3>
                <p className="text-xs sm:text-sm opacity-90 font-typographica mt-1">
                  {isCertificadoForm 
                    ? "Complete los datos del certificado de libertad y tradición"
                    : isPlanosForm
                    ? "Complete los datos de los planos catastrales del predio"
                    : "Complete los datos de las escrituras públicas del inmueble"
                  }
                </p>
              </div>
              
              {/* Contenido del formulario */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                {isLoadingForm ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <FaSpinner className="w-8 h-8 text-[#6e6c35] animate-spin" />
                    <p className="text-[#6e6c35] font-typographica">Cargando formulario...</p>
                  </div>
                ) : (
                  <>
                    {isCertificadoForm && (
                      <CertificadoLibertadTradicionForm
                        initialData={formData}
                        onSubmit={handleFormSubmit}
                        isLoading={isSavingForm}
                        showFixedFooter={true}
                      />
                    )}
                    {isPlanosForm && (
                      <PlanosCatastralesForm
                        initialData={formData}
                        onSubmit={handleFormSubmit}
                        isLoading={isSavingForm}
                        showFixedFooter={true}
                      />
                    )}
                    {isEscriturasForm && (
                      <EscriturasPublicasForm
                        initialData={formData}
                        onSubmit={handleFormSubmit}
                        isLoading={isSavingForm}
                        showFixedFooter={true}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer con controles de navegación (solo para PDFs sin formulario) */}
        {!showForm && !isImage && numPages && numPages > 1 && (
          <div className="bg-[#6e6c35] text-white px-4 sm:px-6 py-3 flex items-center justify-between rounded-b-xl flex-shrink-0">
            <button
              onClick={handlePreviousPage}
              disabled={pageNumber <= 1}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-typographica"
              aria-label="Página anterior"
            >
              <FaChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-typographica hidden sm:inline">Página</span>
              <input
                type="number"
                min="1"
                max={numPages}
                value={pageNumber}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) {
                    setPageNumber(page);
                  }
                }}
                className="w-14 sm:w-16 px-2 py-1 text-center bg-white/20 border border-white/30 rounded text-white text-sm font-typographica focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <span className="text-sm font-typographica">de {numPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={pageNumber >= numPages}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-typographica"
              aria-label="Página siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewerModal;

