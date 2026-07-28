import React, { useState, useEffect, useRef } from "react";
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
  const [lastLoadedDocId, setLastLoadedDocId] = useState(null);
  const [hasAutoCentered, setHasAutoCentered] = useState(false);
  const [pagesText, setPagesText] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { user } = useAuth();

  const viewerScrollRef = useRef(null);

  // Formularios de revisión legal: solo legal y administrador
  const canReviewLegalDocs =
    user?.role === "legal" || user?.role === "admon";

  // Determinar si se debe mostrar el panel del formulario (solo para usuarios autorizados y estos tipos de documentos)
  const showFormPanel = canReviewLegalDocs && (documentType === "CERTIFICADO_TRADICION" || documentType === "PLANO_CATASTRAL" || documentType === "ESCRITURA_PUBLICA") && documentId;
  
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
        setLastLoadedDocId(null);
        return;
      }
      console.log('propertyData XXX', propertyData);

      // Si ya cargamos este documento y tenemos datos en el formulario,
      // no volver a sobreescribir con lo que venga de propertyData
      if (lastLoadedDocId === documentId && formData !== null) {
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
            // Limpiar campos internos del historial (numeroAnotacion y fechaCancelacion)
            // Estos campos son solo para lógica interna, no deben mostrarse en el formulario
            const cleanedFormData = { ...data.formData };
            if (cleanedFormData.historial && Array.isArray(cleanedFormData.historial)) {
              cleanedFormData.historial = cleanedFormData.historial.map(item => {
                const { numeroAnotacion, fechaCancelacion, ...rest } = item;
                return rest;
              });
            }
            setFormData(cleanedFormData);
            setLastLoadedDocId(documentId);
          } else {
            setFormData(null);
            setLastLoadedDocId(documentId);
          }
        } else {
          setFormData(null);
          setLastLoadedDocId(null);
        }
      } catch (err) {
        console.error("Error cargando datos del formulario:", err);
        setFormData(null);
        setLastLoadedDocId(null);
      } finally {
        setIsLoadingForm(false);
      }
    };

    loadFormData();
  }, [isOpen, showForm, documentId, propertyData, formData, lastLoadedDocId]);

  // Resetear estado cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
      setLoading(true);
      setError(null);
      setNumPages(null);
      setHasAutoCentered(false);
      setPagesText([]);
      setSearchQuery("");
      setSearchMatches([]);
      setCurrentMatchIndex(0);
    }
  }, [isOpen, documentUrl]);

  // Cargar texto de todas las páginas del PDF para búsqueda
  useEffect(() => {
    const loadPdfText = async () => {
      if (!isOpen || isImage || !documentUrl) {
        setPagesText([]);
        return;
      }

      try {
        const loadingTask = pdfjs.getDocument(documentUrl);
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        const textByPage = [];

        for (let pageIndex = 1; pageIndex <= totalPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => item.str || "")
            .join(" ");
          console.log(`textContent.items ${pageIndex}`, textContent.items);
          textByPage.push(pageText);
        }

        setPagesText(textByPage);
      } catch (err) {
        console.error("Error cargando texto del PDF para búsqueda:", err);
        setPagesText([]);
      }
    };

    loadPdfText();
  }, [isOpen, isImage, documentUrl]);

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

    // Centrar horizontalmente solo una vez al cargar el PDF
    if (!hasAutoCentered && viewerScrollRef.current) {
      const container = viewerScrollRef.current;
      const { scrollWidth, clientWidth } = container;
      if (scrollWidth > clientWidth) {
        container.scrollLeft = (scrollWidth - clientWidth) / 2;
      }
      setHasAutoCentered(true);
    }
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

  // Aplicar resaltado de coincidencias en la capa de texto del PDF
  const applySearchHighlight = () => {
    if (!viewerScrollRef.current) return;

    const query = searchQuery.trim().toLowerCase();
    const container = viewerScrollRef.current;
    const textSpans = container.querySelectorAll(
      ".react-pdf__Page__textContent span"
    );

    // Determinar cuál es la coincidencia "actual" en esta página
    let currentPageMatchOrder = null;
    const currentMatch = searchMatches[currentMatchIndex];
    if (currentMatch && currentMatch.pageNumber === pageNumber) {
      const samePageMatches = searchMatches.filter(
        (m) => m.pageNumber === currentMatch.pageNumber
      );
      currentPageMatchOrder = samePageMatches.findIndex(
        (m) => m === currentMatch
      );
    }

    let pageMatchCounter = 0;

    textSpans.forEach((span) => {
      const originalText =
        span.dataset.originalText !== undefined
          ? span.dataset.originalText
          : span.textContent || "";

      // Guardar el texto original una sola vez
      if (span.dataset.originalText === undefined) {
        // eslint-disable-next-line no-param-reassign
        span.dataset.originalText = originalText;
      }

      if (!query) {
        // Restaurar texto original si no hay búsqueda
        // eslint-disable-next-line no-param-reassign
        span.innerHTML = originalText;
        return;
      }

      const lowerText = originalText.toLowerCase();
      const index = lowerText.indexOf(query);

      if (index === -1) {
        // No hay coincidencia en este span
        // eslint-disable-next-line no-param-reassign
        span.innerHTML = originalText;
        return;
      }

      const before = originalText.slice(0, index);
      const match = originalText.slice(index, index + query.length);
      const after = originalText.slice(index + query.length);

      // Determinar clase para esta coincidencia:
      // - Coincidencia actual en esta página: anaranjado
      // - Resto de coincidencias: amarillo
      const isCurrentPageActiveMatch =
        currentPageMatchOrder !== null &&
        pageMatchCounter === currentPageMatchOrder;

      const highlightClass = isCurrentPageActiveMatch
        ? "bg-orange-400/80 text-black"
        : "bg-yellow-300/70 text-black";

      pageMatchCounter += 1;

      // Construir HTML con la parte resaltada
      // eslint-disable-next-line no-param-reassign
      span.innerHTML = `${before}<span class="${highlightClass} rounded px-[1px]">${match}</span>${after}`;
    });
  };

  // Reaplicar resaltado cuando cambie el término de búsqueda, la página
  // o el índice de coincidencia actual
  useEffect(() => {
    if (!isImage && !error) {
      applySearchHighlight();
    }
  }, [searchQuery, pageNumber, currentMatchIndex, isImage, error, searchMatches]);

  const handleSearchExecute = (queryOverride) => {
    const trimmedQuery =
      typeof queryOverride === "string"
        ? queryOverride.trim()
        : searchQuery.trim();
    if (!trimmedQuery || !pagesText.length) {
      setSearchMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    const lowerQuery = trimmedQuery.toLowerCase();
    const matches = [];

    pagesText.forEach((pageText, pageIdx) => {
      const lowerText = pageText.toLowerCase();
      let fromIndex = 0;

      // Buscar todas las ocurrencias en la página
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const foundIndex = lowerText.indexOf(lowerQuery, fromIndex);
        if (foundIndex === -1) break;

        matches.push({
          pageNumber: pageIdx + 1,
          charIndex: foundIndex,
        });

        fromIndex = foundIndex + lowerQuery.length;
      }
    });

    setSearchMatches(matches);
    setCurrentMatchIndex(matches.length ? 0 : 0);

    if (matches.length) {
      setPageNumber(matches[0].pageNumber);
    }
  };

  const handleNextMatch = () => {
    if (!searchMatches.length) return;

    setCurrentMatchIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % searchMatches.length;
      const match = searchMatches[nextIndex];
      if (match?.pageNumber) {
        setPageNumber(match.pageNumber);
      }
      return nextIndex;
    });
  };

  const handlePreviousMatch = () => {
    if (!searchMatches.length) return;

    setCurrentMatchIndex((prevIndex) => {
      const nextIndex =
        (prevIndex - 1 + searchMatches.length) % searchMatches.length;
      const match = searchMatches[nextIndex];
      if (match?.pageNumber) {
        setPageNumber(match.pageNumber);
      }
      return nextIndex;
    });
  };

  // Pantalla completa deshabilitada a petición: solo controles de zoom y navegación

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    // Si el foco está en un campo editable (por ejemplo, el buscador),
    // no aplicar atajos globales de zoom/navegación para no interferir con la escritura.
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable)
    ) {
      return;
    }
    
    if (e.key === "ArrowLeft" && !isImage && numPages) {
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

      // Limpiar campos internos del historial antes de guardar
      // numeroAnotacion y fechaCancelacion son solo para lógica interna, no deben guardarse en el formulario
      const cleanedFormData = { ...formData };
      if (cleanedFormData.historial && Array.isArray(cleanedFormData.historial)) {
        cleanedFormData.historial = cleanedFormData.historial.map(item => {
          const { numeroAnotacion, fechaCancelacion, ...rest } = item;
          return rest;
        });
      }

      // Actualizar con los datos del formulario
      const updatedData = {
        ...existingData,
        formData: cleanedFormData,
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
      setLastLoadedDocId(documentId);
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

  // Función para limpiar texto repetitivo del PDF
  const cleanRepetitiveText = (text) => {
    if (!text) return text;
    
    // Patrón específico a eliminar - texto completo que se repite en encabezados
    // Captura variaciones con "Y" o "&" y cualquier nombre de oficina
    const patterns = [
      /SUPERINTENDENCIA\s+DE\s+NOTARIADO\s+[Y&]\s+REGISTRO\s+LA\s+GUARDA\s+DE\s+LA\s+FE\s+PUBLICA\s+OFICINA\s+DE\s+REGISTRO\s+DE\s+INSTRUMENTOS\s+PUBLICOS\s+DE\s+[A-Z\s]+\s+ORIP/gi,
      // Variación sin ORIP al final
      /SUPERINTENDENCIA\s+DE\s+NOTARIADO\s+[Y&]\s+REGISTRO\s+LA\s+GUARDA\s+DE\s+LA\s+FE\s+PUBLICA\s+OFICINA\s+DE\s+REGISTRO\s+DE\s+INSTRUMENTOS\s+PUBLICOS\s+DE\s+[A-Z\s]+/gi,
    ];
    
    let cleaned = text;
    // Eliminar todas las ocurrencias de cada patrón
    patterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    
    // Limpiar espacios múltiples resultantes
    cleaned = cleaned.replace(/\s{3,}/g, ' ');
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    return cleaned.trim();
  };

  // Función para extraer datos del PDF del certificado de tradición
  const extractCertificadoData = (fullText) => {
    const extracted = {};
    let text = fullText || pagesText.join(" ");

    // Limpiar texto repetitivo antes de procesar
    text = cleanRepetitiveText(text);

    // PIN del Certificado - "Pin No: 2504084411112032277"
    const pinMatch = text.match(/Pin\s+No[:\s]+(\d+)/i);
    if (pinMatch) extracted.pinCertificado = pinMatch[1].trim();

    // Fecha de Expedición - "Impreso el 8 de Abril de 2025"
    const fechaExpMatch = text.match(/Impreso\s+el\s+(\d{1,2})\s+de\s+([A-Za-z]+)\s+de\s+(\d{4})/i);
    if (fechaExpMatch) {
      const day = fechaExpMatch[1].padStart(2, '0');
      const monthNames = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
        'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
        'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
      };
      const month = monthNames[fechaExpMatch[2].toLowerCase()] || '01';
      const year = fechaExpMatch[3];
      extracted.fechaExpedicion = `${year}-${month}-${day}`;
    }

    // Estado del Folio - "ESTADO DEL FOLIO: ACTIVO"
    const estadoFolioMatch = text.match(/ESTADO\s+DEL\s+FOLIO[:\s]+([A-Za-z]+)/i);
    if (estadoFolioMatch) {
      const estado = estadoFolioMatch[1].trim();
      extracted.estadoFolio = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    }

    // Número de Matrícula Inmobiliaria - "Nro Matrícula: 234-5815"
    const matriculaMatch = text.match(/Nro\s+Matr[ií]cula[:\s]+([0-9\-]+)/i);
    if (matriculaMatch) extracted.numeroMatriculaInmobiliaria = matriculaMatch[1].trim();

    // Código Catastral - "CÓDIGO CATASTRAL: 505680001000000010527000000000"
    const codigoCatastralMatch = text.match(/C[ÓO]DIGO\s+CATASTRAL[:\s]+([A-Z0-9]+)/i);
    if (codigoCatastralMatch) extracted.codigoCatastral = codigoCatastralMatch[1].trim();

    // Departamento - "DEPTO: META"
    const deptMatch = text.match(/DEPTO[:\s]+([A-Za-z\s]+?)(?:\s+MUNICIPIO|$)/i);
    if (deptMatch) extracted.departamento = deptMatch[1].trim().toUpperCase();

    // Municipio - "MUNICIPIO: PUERTO GAITAN"
    const municipioMatch = text.match(/MUNICIPIO[:\s]+([A-Za-z\s]+?)(?:\s+VEREDA|$)/i);
    if (municipioMatch) extracted.municipio = municipioMatch[1].trim().toUpperCase();

    // Tipo de Predio - "Tipo Predio: RURAL"
    const tipoPredioMatch = text.match(/Tipo\s+Predio[:\s]+([A-Za-z]+)/i);
    if (tipoPredioMatch) {
      const tipo = tipoPredioMatch[1].trim();
      const validTypes = ["Urbano", "Suburbano", "Rural", "Hipotecario", "Dominante", "Sirviente"];
      const tipoCapitalized = tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
      if (validTypes.includes(tipoCapitalized)) extracted.tipoPredio = tipoCapitalized;
    }

    // Tipo de Inmueble - Buscar en descripción o inferir de contexto
    // Si dice "LOTE" o similar, asignar "Lote"
    const tipoInmuebleMatch = text.match(/LOTE\s+RURAL/i);
    if (tipoInmuebleMatch) {
      extracted.tipoInmueble = "Lote";
    }

    // Dirección del Inmueble - Buscar después de "DIRECCION DEL INMUEBLE"
    const direccionMatch = text.match(/DIRECCION\s+DEL\s+INMUEBLE[\s\S]*?Tipo\s+Predio[:\s]+[A-Za-z]+\s+([A-Za-z0-9\s#\-\.,]+?)(?:\n|DETERMINACION|$)/i);
    if (direccionMatch) {
      const dir = direccionMatch[1].trim();
      if (dir.length < 200 && dir.length > 0) extracted.direccionPredio = dir;
    }

    // Área del Terreno - "VEINTIDOS HECTAREAS (722 HAS)"
    const areaTerrenoMatch = text.match(/(?:HECTAREAS|HAS)[\s:]*\((\d+(?:\.\d+)?)\s*HAS?\)/i);
    if (areaTerrenoMatch) {
      extracted.areaTerrenoM2 = areaTerrenoMatch[1].trim();
    } else {
      // Buscar en formato "AREA PRIVADA - METROS CUADRADOS:"
      const areaM2Match = text.match(/AREA\s+PRIVADA[^\d]*METROS\s+CUADRADOS[:\s]+(\d+(?:\.\d+)?)/i);
      if (areaM2Match) extracted.areaTerrenoM2 = areaM2Match[1].trim();
    }

    // Área Construida - "AREA CONSTRUIDA - METROS CUADRADOS:"
    const areaConstruidaMatch = text.match(/AREA\s+CONSTRUIDA[^\d]*METROS\s+CUADRADOS[:\s]+(\d+(?:\.\d+)?)/i);
    if (areaConstruidaMatch) extracted.areaConstruidaM2 = areaConstruidaMatch[1].trim();

    // Datos de Complementación - Todo el texto entre "COMPLEMENTACION:" y "DIRECCION DEL INMUEBLE"
    const complementacionMatch = text.match(/COMPLEMENTACION:([\s\S]*?)DIRECCION\s+DEL\s+INMUEBLE/i);
    if (complementacionMatch) {
      let complementacion = complementacionMatch[1].trim();
      // Limpiar saltos de línea múltiples
      complementacion = complementacion.replace(/\n+/g, '\n').trim();
      if (complementacion.length > 0) extracted.datosComplementacion = complementacion;
    }

    // Extraer información del propietario actual (última anotación con "A:" que tenga NIT o CC)
    // Buscar todas las anotaciones
    const anotaciones = text.match(/ANOTACION[:\s]+Nro\s+(\d+)/gi);
    
    if (anotaciones && anotaciones.length > 0) {
      // Obtener el número de la última anotación
      const lastAnotacionNum = anotaciones[anotaciones.length - 1].match(/\d+/)[0];
      
      // Buscar la sección de la última anotación
      const anotacionIndex = text.lastIndexOf(`ANOTACION: Nro ${lastAnotacionNum}`);
      if (anotacionIndex !== -1) {
        const anotacionSection = text.substring(anotacionIndex);
        
        // Buscar el propietario actual (último "A:" con documento)
        const propietarioMatches = [...anotacionSection.matchAll(/A:\s+([^\n]+?)\s+(?:NIT|CC|CE|Pasaporte)[#:\s]+([0-9A-Z]+)/gi)];
        if (propietarioMatches.length > 0) {
          const lastPropietario = propietarioMatches[propietarioMatches.length - 1];
          extracted.nombreCompletoORazonSocial = lastPropietario[1].trim();
          
          // Determinar tipo de documento
          const docTypeMatch = lastPropietario[0].match(/(NIT|CC|CE|Pasaporte)[#:\s]+([0-9A-Z]+)/i);
          if (docTypeMatch) {
            const tipoDoc = docTypeMatch[1].toUpperCase();
            if (tipoDoc === 'NIT') extracted.tipoDocumento = 'NIT';
            else if (tipoDoc === 'CC') extracted.tipoDocumento = 'CC';
            else if (tipoDoc === 'CE') extracted.tipoDocumento = 'CE';
            else if (tipoDoc === 'PASAPORTE') extracted.tipoDocumento = 'Pasaporte';
            
            extracted.numeroDocumento = docTypeMatch[2].trim();
          }
        }
        
        // Modo de Adquisición Actual - "MODO DE ADQUISICION: 0128 CONSTITUCION DE FIDUCIA MERCANTIL"
        const modoAdqMatch = anotacionSection.match(/MODO\s+DE\s+ADQUISICION[:\s]+([^\n]+)/i);
        if (modoAdqMatch) {
          extracted.modoAdquisicionActual = modoAdqMatch[1].trim();
        }
        
        // Fecha de Inscripción - "Fecha: 10-12-2019"
        const fechaInscMatch = anotacionSection.match(/Fecha[:\s]+(\d{1,2})-(\d{1,2})-(\d{4})/);
        if (fechaInscMatch) {
          const day = fechaInscMatch[1].padStart(2, '0');
          const month = fechaInscMatch[2].padStart(2, '0');
          const year = fechaInscMatch[3];
          extracted.fechaInscripcion = `${year}-${month}-${day}`;
        }
      }
    }

    // Extraer Historial Jurídico - Extraer cada anotación completa
    const historial = [];
    
    // Dividir el texto en anotaciones individuales
    // El split crea bloques, pero el primero puede ser texto previo a la primera anotación
    const anotacionesBlocks = text.split(/(?=ANOTACION[:\s]+Nro\s+\d+)/gi);
    console.log('anotacionesBlocks', anotacionesBlocks);
    
    // Primero, crear un mapa de cancelaciones: número de anotación cancelada -> fecha de cancelación
    // Buscamos el patrón "Se cancela anotación No: X" o variaciones
    const cancelacionesMap = new Map();
    
    for (const block of anotacionesBlocks) {
      if (!block.trim()) continue;
      
      const hasValidAnotacion = /ANOTACION[:\s]+Nro\s+\d+/i.test(block);
      if (!hasValidAnotacion) continue;
      
      // Extraer fecha de esta anotación
      const fechaMatch = block.match(/Fecha[:\s]+(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (!fechaMatch) continue;
      
      const day = fechaMatch[1].padStart(2, '0');
      const month = fechaMatch[2].padStart(2, '0');
      const year = fechaMatch[3];
      const fechaCancelacion = `${year}-${month}-${day}`;
      
      // Extraer especificación para buscar el patrón de cancelación
      const especMatch = block.match(/ESPECIFICACION[:\s]+(.+?)(?=\s*(?:PERSONAS\s+QUE\s+INTERVIENEN|ANOTACION[:\s]+Nro|$))/is);
      if (!especMatch) continue;
      
      const especificacion = especMatch[1].trim().replace(/\s+/g, ' ');
      
      // Buscar patrón "Se cancela anotación No: X" o variaciones
      // Patrones posibles:
      // - "Se cancela anotación No: 5"
      // - "Se cancela anotación Nro: 5"
      // - "Se cancela anotación No. 5"
      // - "Se cancela anotación Nro. 5"
      // - "Se cancela anotación número 5"
      // - "Se cancela anotación N° 5"
      const cancelacionPatterns = [
        /Se\s+cancela\s+anotaci[oó]n\s+(?:No|Nro|Número|N°)[:\s.]+(\d+)/i,
        /Se\s+cancela\s+anotaci[oó]n\s+(\d+)/i,
        /Cancela\s+anotaci[oó]n\s+(?:No|Nro|Número|N°)[:\s.]+(\d+)/i,
        /Cancela\s+anotaci[oó]n\s+(\d+)/i,
      ];
      
      for (const pattern of cancelacionPatterns) {
        const match = especificacion.match(pattern);
        if (match && match[1]) {
          const numeroAnotacionCancelada = match[1];
          cancelacionesMap.set(numeroAnotacionCancelada, fechaCancelacion);
          break;
        }
      }
    }
    
    // Ahora procesar todas las anotaciones y asignar fechas de cancelación
    for (const block of anotacionesBlocks) {
      if (!block.trim()) continue;
      
      // Validar que el bloque realmente contiene una anotación válida
      // Debe contener "ANOTACION" seguido de "Nro" y un número (no "Nro Matrícula")
      const hasValidAnotacion = /ANOTACION[:\s]+Nro\s+\d+/i.test(block);
      if (!hasValidAnotacion) continue;
      
      // Extraer número de anotación
      const nroMatch = block.match(/ANOTACION[:\s]+Nro\s+(\d+)/i);
      if (!nroMatch) continue;
      
      // Validación adicional: debe tener una fecha para ser una anotación válida
      const hasFecha = /Fecha[:\s]+\d{1,2}-\d{1,2}-\d{4}/.test(block);
      if (!hasFecha) continue;
      
      // Extraer fecha
      const fechaMatch = block.match(/Fecha[:\s]+(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (!fechaMatch) continue;
      
      const day = fechaMatch[1].padStart(2, '0');
      const month = fechaMatch[2].padStart(2, '0');
      const year = fechaMatch[3];
      const fechaEvento = `${year}-${month}-${day}`;
      
      // Extraer especificación completa - desde ESPECIFICACION hasta PERSONAS QUE INTERVIENEN o siguiente ANOTACION
      const especMatch = block.match(/ESPECIFICACION[:\s]+(.+?)(?=\s*(?:PERSONAS\s+QUE\s+INTERVIENEN|ANOTACION[:\s]+Nro|$))/is);
      if (!especMatch) continue;
      
      let especificacion = especMatch[1].trim();
      // Limpiar espacios múltiples
      especificacion = especificacion.replace(/\s+/g, ' ').trim();
      
      // Función genérica para extraer contenido después de un título seguido de dos puntos
      const extractAfterFirstTitle = (text) => {
        // Patrón: "TITULO: contenido"
        const match = text.match(/^([^:]+):\s*(.+)$/);
        if (match && match[1] && match[2]) {
          return {
            tipoEvento: match[1].trim(),
            detalleEvento: match[2].trim(),
          };
        }

        // Si no hay ":", intentar patrón "COD TITULO detalle" o "TITULO detalle"
        const tokens = text.split(/\s+/).filter(Boolean);
        if (tokens.length >= 2) {
          let tipoEvento = "";
          let detalleEvento = "";

          if (/^\d+$/.test(tokens[0])) {
            // Ej: "0205 HIPOTECA ABIERTA VALOR..." -> tipoEvento = "HIPOTECA", detalle = resto
            tipoEvento = tokens[1].trim();
            detalleEvento = tokens.slice(2).join(" ").trim();
          } else {
            // Ej: "CANCELACION 0843 CANCELACION POR..." -> tipoEvento = "CANCELACION", detalle = resto
            tipoEvento = tokens[0].trim();
            detalleEvento = tokens.slice(1).join(" ").trim();
          }

          return { tipoEvento, detalleEvento };
        }

        // Si no se puede separar, usar todo como tipo y dejar detalle vacío
        return {
          tipoEvento: text.trim(),
          detalleEvento: "",
        };
      };

      const { tipoEvento, detalleEvento } = extractAfterFirstTitle(especificacion);
      const numeroAnotacion = nroMatch[1];
      
      // Buscar si esta anotación fue cancelada usando el mapa de cancelaciones
      const fechaCancelacion = cancelacionesMap.get(numeroAnotacion);
      
      // Agregar todas las anotaciones al historial, incluyendo cancelaciones
      historial.push({
        fechaEvento,
        tipoEvento,
        detalleEvento,
        // Guardamos número de anotación y fecha de cancelación solo a nivel de datos,
        // no se exponen como campos editables en el formulario.
        numeroAnotacion,
        fechaCancelacion: fechaCancelacion || undefined,
      });
    }
    
    if (historial.length > 0) extracted.historial = historial;

    console.log('historial', historial);
    // Extraer Gravámenes - solo anotaciones con tipoEvento "GRAVAMEN"
    const gravamenes = [];
    
    // Buscar anotaciones que sean gravámenes (tipoEvento contiene HIPOTECA, EMBARGO, etc.)
    for (const historialItem of historial) {
      // Verificar si el tipoEvento indica que es un gravamen
      const tipoEventoUpper = historialItem.tipoEvento.toUpperCase();
      if (tipoEventoUpper.includes('HIPOTECA') || 
          tipoEventoUpper.includes('EMBARGO') || 
          tipoEventoUpper.includes('SERVIDUMBRE') || 
          tipoEventoUpper.includes('PROHIBICION') || 
          tipoEventoUpper.includes('GRAVAMEN')) {
        
        // Buscar el bloque de anotación correspondiente para extraer información adicional
        const anotacionBlock = anotacionesBlocks.find(block => {
          const nroMatch = block.match(/ANOTACION[:\s]+Nro\s+(\d+)/i);
          return nroMatch && nroMatch[1] === historialItem.numeroAnotacion;
        });
        
        if (anotacionBlock) {
          // Determinar tipo de gravamen
          let tipoGravamen = 'Otro';
          if (tipoEventoUpper.includes('HIPOTECA')) tipoGravamen = 'Hipoteca';
          else if (tipoEventoUpper.includes('EMBARGO')) tipoGravamen = 'Embargo';
          else if (tipoEventoUpper.includes('SERVIDUMBRE')) tipoGravamen = 'Servidumbre';
          else if (tipoEventoUpper.includes('PROHIBICION')) tipoGravamen = 'Prohibición de Enajenar';
          
          // Buscar entidad/persona asociada en la sección "DE:"
          const deMatch = anotacionBlock.match(/DE:\s+([^\n]+?)\s+(?:NIT|CC|CE|Pasaporte)[#:\s]+([0-9A-Z]+)/i);
          const entidadPersonaAsociada = deMatch ? deMatch[1].trim() : '';
          
          gravamenes.push({
            tipoGravamen,
            descripcionGravamen: historialItem.detalleEvento,
            fechaRegistro: historialItem.fechaEvento,
            fechaCancelacion: historialItem.fechaCancelacion || undefined,
            entidadPersonaAsociada
          });
        }
      }
    }
    
    if (gravamenes.length > 0) extracted.gravamenes = gravamenes;

    return extracted;
  };

  // Función para manejar el autorrellenado
  const handleAutoFill = async () => {
    if (isImage || !pagesText.length) {
      toast.warning("El autorrellenado solo está disponible para documentos PDF");
      return;
    }

    if (!isCertificadoForm) {
      toast.warning("El autorrellenado solo está disponible para certificados de tradición");
      return;
    }

    try {
      const fullText = pagesText.join(" ");
      const extractedData = extractCertificadoData(fullText);
      
      // Contar cuántos campos se extrajeron
      const extractedCount = Object.keys(extractedData).filter(key => {
        const value = extractedData[key];
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== null && value !== '';
      }).length;
      
      if (extractedCount === 0) {
        toast.warning("No se pudieron extraer datos del PDF. Verifique que el documento sea un certificado de tradición válido.");
        return;
      }

      // Actualizar formData con los datos extraídos
      const updatedFormData = {
        ...formData,
        ...extractedData,
      };

      setFormData(updatedFormData);
      toast.success(`Se extrajeron ${extractedCount} campos del PDF. Revise y complete los campos faltantes.`);
    } catch (error) {
      console.error("Error en autorrellenado:", error);
      toast.error("Error al extraer datos del PDF. Por favor, intente nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      data-document-viewer-modal
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4"
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

            {/* Controles superiores (búsqueda + zoom/rotar) solo para PDFs */}
            {!isImage && (
              <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
                {/* Buscador */}
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      handleSearchExecute(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchExecute();
                      }
                    }}
                    placeholder="Buscar..."
                    className="w-28 sm:w-40 px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6e6c35]/60 font-typographica"
                    aria-label="Buscar en el documento"
                  />
                  <button
                    onClick={handleSearchExecute}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Ejecutar búsqueda"
                    title="Buscar (Enter)"
                  >
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-600 font-typographica">
                    <span>
                      {searchMatches.length > 0
                        ? `${currentMatchIndex + 1} / ${searchMatches.length}`
                        : "0 / 0"}
                    </span>
                  </div>
                  <button
                    onClick={handlePreviousMatch}
                    disabled={!searchMatches.length}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Coincidencia anterior"
                    title="Coincidencia anterior"
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleNextMatch}
                    disabled={!searchMatches.length}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Siguiente coincidencia"
                    title="Siguiente coincidencia"
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Zoom + rotación */}
                <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 px-2 py-1.5">
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
              </div>
            )}
            
            {/* Área de visualización */}
            <div
              ref={viewerScrollRef}
              className="flex-1 min-h-0 overflow-auto p-2 sm:p-3 md:p-4 bg-white"
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
            <div className="inline-block bg-white rounded-lg shadow-lg p-2">
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
                  onRenderTextLayerSuccess={applySearchHighlight}
                  className="shadow-lg"
                />
              </Document>
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
                        onAutoFill={handleAutoFill}
                        canAutoFill={!isImage && pagesText.length > 0 && isCertificadoForm}
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

