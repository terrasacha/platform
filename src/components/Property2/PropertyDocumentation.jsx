import React, { useState, useEffect, useRef } from "react";
import { usePropertyData } from "context/PropertyDataContext";
import { useS3Client } from "context/s3ClientContext";
import { useAuth } from "context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { API, graphqlOperation } from "aws-amplify";
import { createDocument, deleteDocument, createPropertyFeature, createVerification } from "graphql/mutations";
import { listPropertyFeatures, listVerifications } from "graphql/queries";
import {
  FaFileAlt,
  FaFileContract,
  FaMap,
  FaHandshake,
  FaPlus,
  FaUpload,
  FaTrash,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import DocumentViewerModal from "./DocumentViewerModal";

// Tipos de documentos requeridos
const requiredDocuments = [
  {
    id: "certificado_libertad",
    name: "Certificado de Libertad y Tradición",
    icon: FaFileAlt,
    description: "Documento que acredita la propiedad",
    color: "red",
    consultantOnly: false,
  },
  {
    id: "escrituras_publicas",
    name: "Escrituras Públicas",
    icon: FaFileContract,
    description: "Documento notarial de la propiedad",
    color: "blue",
    consultantOnly: false,
  },
  {
    id: "planos_catastrales",
    name: "Planos Catastrales",
    icon: FaMap,
    description: "Planos oficiales o a mano alzada del predio",
    color: "green",
    consultantOnly: false,
  },
  {
    id: "memorando_entendimiento",
    name: "Memorando de Entendimiento",
    icon: FaHandshake,
    description: "Acuerdo de entendimiento entre las partes",
    color: "purple",
    consultantOnly: true,
  },
];

// Tipos de documentos adicionales eliminados (se maneja como genérico)

export default function PropertyDocumentation({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
}) {
  const { propertyData, refresh: refreshPropertyData } = usePropertyData();
  const { s3Client, bucketName } = useS3Client();
  const { user } = useAuth();
  
  // Cache para evitar crear múltiples veces el GLOBAL_PROPERTY_FILES
  const globalFilesFeatureRef = useRef(null);
  const isCreatingGlobalFeatureRef = useRef(false);
  
  // Verificar roles de usuario
  const isConsultant = user?.role === "validator";
  const isOwner = user?.role === "constructor";
  const isLegal = user?.role === "legal";
  const isAdmon = user?.role === "admon";

  const canUploadRequiredDoc = (doc) => {
    if (doc.consultantOnly) {
      return isConsultant;
    }
    return isOwner;
  };

  // Consultor: solo puede abrir el Memorando. Resto: legal / propietario / admin.
  const canViewRequiredDoc = (doc) => {
    if (doc.consultantOnly) {
      return isConsultant || isLegal || isAdmon || isOwner;
    }
    if (isConsultant) return false;
    return isLegal || isAdmon || isOwner;
  };

  const canViewAdditionalDocs = !isConsultant;

  const canUploadAdditionalDocs = isOwner;

  const getBlockedDocMessage = (doc) => {
    if (doc.consultantOnly && !isConsultant) {
      return "Este documento debe ser subido por un consultor.";
    }
    if (isConsultant && !doc.consultantOnly) {
      return "La carga de documentos solo puede ser realizada por el propietario del predio.";
    }
    return "No tienes permisos para cargar documentos con tu rol actual.";
  };

  const getViewBlockedMessage = (doc) => {
    if (isConsultant && !doc.consultantOnly) {
      return "Este documento solo puede ser visualizado por el revisor legal.";
    }
    return "No tienes permisos para visualizar este documento.";
  };

  const showUploadPermissionError = (message) => {
    Swal.fire({
      title: "Acción no permitida",
      text:
        message ||
        "No tienes permisos para cargar documentos con tu rol actual. La carga de documentos solo puede ser realizada por el propietario del predio.",
      icon: "info",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#8B4513",
    });
  };

  const showUploadError = (error) => {
    const errorText = [
      error?.message,
      ...(error?.errors || []).map((entry) => entry.message),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const isPermissionError =
      errorText.includes("unauthorized") ||
      errorText.includes("not authorized") ||
      errorText.includes("access denied") ||
      errorText.includes("permission") ||
      errorText.includes("forbidden");

    if (isPermissionError) {
      showUploadPermissionError();
      return;
    }

    Swal.fire({
      title: "Error al Subir Documento",
      text: "Hubo un problema al subir el documento. Por favor intenta nuevamente.",
      icon: "error",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#8B4513",
    });
  };

  // Estados para documentos requeridos
  const [requiredDocs, setRequiredDocs] = useState({});
  
  // Estados para documentos adicionales
  const [additionalDocs, setAdditionalDocs] = useState([]);
  const [draggedOverCard, setDraggedOverCard] = useState(null);
  const [dragCounter, setDragCounter] = useState(0);
  const [hoveredBlockedDoc, setHoveredBlockedDoc] = useState(null);
  
  // Estados para el modal de visualización
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [viewerDocumentUrl, setViewerDocumentUrl] = useState(null);
  const [viewerDocumentName, setViewerDocumentName] = useState(null);
  const [viewerDocumentId, setViewerDocumentId] = useState(null);
  const [viewerDocumentType, setViewerDocumentType] = useState(null);

  // Inicializar documentos requeridos
  useEffect(() => {
    const initialDocs = {};
    requiredDocuments.forEach((doc) => {
      initialDocs[doc.id] = null;
    });
    setRequiredDocs(initialDocs);
  }, []);

  // Mapeo inverso para poblar requeridos desde DB
  const mapTypeCodeToRequiredId = (typeCode) => {
    const map = {
      CERTIFICADO_TRADICION: 'certificado_libertad',
      ESCRITURA_PUBLICA: 'escrituras_publicas',
      PLANO_CATASTRAL: 'planos_catastrales',
      MEMORANDO_ENTENDIMIENTO: 'memorando_entendimiento',
    };
    return map[typeCode] || null;
  };

  // Tipos de documentos relacionados con propietarios que NO deben aparecer en documentos adicionales
  const ownerRelatedTypes = [
    'OWNER_BUNDLE',
    'USER_ID_FRONT',
    'USER_ID_BACK',
    'USER_SELFIE',
    'OWNER_INFO',
    'OWNER_RELATION',
  ];

  // Cargar documentos ya existentes desde propertyData → GLOBAL_PROPERTY_FILES
  useEffect(() => {
    if (!propertyData?.propertyFeatures) return;

    const globalFeature = getGlobalFilesPropertyFeature();
    const docs = globalFeature?.documents?.items || [];

    if (!Array.isArray(docs) || docs.length === 0) return;

    // Preparar copias locales
    const nextRequired = { ...requiredDocs };
    const nextAdditional = [];

    docs.forEach((document) => {
      let data = {};
      try {
        data = JSON.parse(document.data || '{}');
      } catch {
        data = {};
      }
      const fileName = data.name || document.id;
      const fileUrl = data.url || document.url;
      const typeCode = data.type || 'OTRO';
      const uploadedAtISO = document.timeStamp
        ? new Date(document.timeStamp * 1000).toISOString()
        : (document.createdAt || new Date().toISOString());
      const status = document.status || 'pending_review';

      // Excluir documentos relacionados con propietarios
      if (ownerRelatedTypes.includes(typeCode)) {
        return; // Saltar este documento
      }

      const requiredId = mapTypeCodeToRequiredId(typeCode);
      if (requiredId) {
        nextRequired[requiredId] = {
          file: null,
          url: fileUrl,
          name: fileName,
          uploadedAt: uploadedAtISO,
          status: document.status || status,
          isApproved: document.isApproved || false,
          documentId: document.id,
          s3Key: extractKeyFromUrl(fileUrl),
          typeCode: typeCode,
        };
      } else {
        nextAdditional.push({
          id: document.id,
          type: 'Documento adicional',
          file: null,
          url: fileUrl,
          name: fileName,
          uploadedAt: uploadedAtISO,
          status,
          documentId: document.id,
          s3Key: extractKeyFromUrl(fileUrl),
          typeCode: typeCode,
        });
      }
    });

    setRequiredDocs(nextRequired);
    setAdditionalDocs(nextAdditional);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyData]);

  // Helper: obtener PropertyFeature para GLOBAL_PROPERTY_FILES (desde contexto o cache local)
  const getGlobalFilesPropertyFeature = () => {
    try {
      const fromContext = propertyData?.propertyFeatures?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
      );
      return fromContext || globalFilesFeatureRef.current || null;
    } catch {
      return null;
    }
  };

  // Asegurar (obtener o crear) el PropertyFeature GLOBAL_PROPERTY_FILES, siguiendo la lógica de PropertyOwners
  const ensureGlobalFilesPropertyFeature = async () => {
    // 1) Si ya lo tenemos en cache, devolverlo
    if (globalFilesFeatureRef.current?.id) return globalFilesFeatureRef.current;

    // 2) Si viene en propertyData, cachearlo
    const fromContext = propertyData?.propertyFeatures?.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );
    if (fromContext?.id) {
      globalFilesFeatureRef.current = fromContext;

      // Verificar/crear Verification asociado (mismo patrón que PropertyOwners)
      try {
        const verificationResp = await API.graphql(
          graphqlOperation(listVerifications, {
            filter: {
              propertyFeatureID: { eq: fromContext.id },
            },
          })
        );

        const existingVerification =
          verificationResp?.data?.listVerifications?.items?.[0];

        if (!existingVerification) {
          const userId =
            propertyData?.projectPostulant?.id ||
            propertyData?.propertyInfo?.userID;
          if (userId) {
            const verificationInput = {
              propertyFeatureID: fromContext.id,
              userVerifiedID: userId,
            };

            await API.graphql(
              graphqlOperation(createVerification, { input: verificationInput })
            );
            console.log(
              "✅ Verification creado para GLOBAL_PROPERTY_FILES desde contexto (PropertyDocumentation)"
            );
          }
        }
      } catch (verificationErr) {
        console.error(
          "Error verificando/creando verification en PropertyDocumentation:",
          verificationErr
        );
      }

      return fromContext;
    }

    // 3) Evitar condiciones de carrera si otro flujo lo está creando
    if (isCreatingGlobalFeatureRef.current) {
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (globalFilesFeatureRef.current?.id)
          return globalFilesFeatureRef.current;
      }
    }

    if (!propertyData?.propertyInfo?.id) return null;

    // 4) Consultar en backend por si ya existe
    try {
      const resp = await API.graphql(
        graphqlOperation(listPropertyFeatures, {
          filter: {
            propertyID: { eq: propertyData.propertyInfo.id },
            featureID: { eq: "GLOBAL_PROPERTY_FILES" },
          },
        })
      );
      const found = resp?.data?.listPropertyFeatures?.items?.[0] || null;
      if (found?.id) {
        globalFilesFeatureRef.current = found;

        // Verificar/crear Verification asociado
        try {
          const verificationResp = await API.graphql(
            graphqlOperation(listVerifications, {
              filter: {
                propertyFeatureID: { eq: found.id },
              },
            })
          );

          const existingVerification =
            verificationResp?.data?.listVerifications?.items?.[0];

          if (!existingVerification) {
            const userId =
              propertyData?.projectPostulant?.id ||
              propertyData?.propertyInfo?.userID;
            if (userId) {
              const verificationInput = {
                propertyFeatureID: found.id,
                userVerifiedID: userId,
              };

              await API.graphql(
                graphqlOperation(createVerification, { input: verificationInput })
              );
              console.log(
                "✅ Verification creado para GLOBAL_PROPERTY_FILES existente (PropertyDocumentation)"
              );
            }
          }
        } catch (verificationErr) {
          console.error(
            "Error verificando/creando verification existente en PropertyDocumentation:",
            verificationErr
          );
        }

        return found;
      }
    } catch (err) {
      console.warn(
        "Fallo consultando listPropertyFeatures en PropertyDocumentation:",
        err
      );
    }

    // 5) Crear un nuevo PropertyFeature GLOBAL_PROPERTY_FILES
    try {
      isCreatingGlobalFeatureRef.current = true;
      const input = {
        propertyID: propertyData.propertyInfo.id,
        featureID: "GLOBAL_PROPERTY_FILES",
        value: "{}",
        isToBlockChain: false,
        isOnMainCard: false,
        isResult: false,
        order: 0,
      };

      const resp = await API.graphql(
        graphqlOperation(createPropertyFeature, { input })
      );
      const created = resp?.data?.createPropertyFeature || null;

      if (created?.id) {
        globalFilesFeatureRef.current = created;

        // Crear Verification asociado
        try {
          const userId =
            propertyData?.projectPostulant?.id ||
            propertyData?.propertyInfo?.userID;
          if (userId) {
            const verificationResp = await API.graphql(
              graphqlOperation(listVerifications, {
                filter: {
                  propertyFeatureID: { eq: created.id },
                },
              })
            );

            const existingVerification =
              verificationResp?.data?.listVerifications?.items?.[0];

            if (!existingVerification) {
              const verificationInput = {
                propertyFeatureID: created.id,
                userVerifiedID: userId,
              };

              await API.graphql(
                graphqlOperation(createVerification, { input: verificationInput })
              );
              console.log(
                "✅ Verification creado para nuevo GLOBAL_PROPERTY_FILES (PropertyDocumentation)"
              );
            } else {
              console.log(
                "ℹ️ Verification ya existe para este feature (PropertyDocumentation)"
              );
            }
          } else {
            console.warn(
              "⚠️ No se pudo crear verification: userId no disponible (PropertyDocumentation)"
            );
          }
        } catch (verificationErr) {
          console.error(
            "Error creando verification para nuevo GLOBAL_PROPERTY_FILES en PropertyDocumentation:",
            verificationErr
          );
        }
      }

      return created;
    } catch (err) {
      console.error(
        "Error creando GLOBAL_PROPERTY_FILES en PropertyDocumentation:",
        err
      );
      return null;
    } finally {
      isCreatingGlobalFeatureRef.current = false;
    }
  };

  // Helper: mapear id requerido -> código de tipo consistente con PropertyDetails
  const mapRequiredIdToTypeCode = (docId) => {
    const map = {
      certificado_libertad: "CERTIFICADO_TRADICION",
      escrituras_publicas: "ESCRITURA_PUBLICA",
      planos_catastrales: "PLANO_CATASTRAL",
      memorando_entendimiento: "MEMORANDO_ENTENDIMIENTO",
    };
    return map[docId] || "OTRO";
  };

  // Persistir documento en DB, asegurando previamente el GLOBAL_PROPERTY_FILES
  const saveDocumentToDB = async ({ url, name, typeCode, s3Key }) => {
    const globalFeature = await ensureGlobalFilesPropertyFeature();
    if (!globalFeature?.id) {
      console.warn(
        "No se pudo asegurar PropertyFeature GLOBAL_PROPERTY_FILES para el predio (PropertyDocumentation)"
      );
      return null;
    }

    const userId =
      propertyData?.projectPostulant?.id || propertyData?.propertyInfo?.userID;
    if (!userId) {
      console.warn(
        "No se encontró userID para asociar el documento en PropertyDocumentation"
      );
    }

    const input = {
      data: JSON.stringify({ name, type: typeCode, url, s3Key }),
      url,
      status: "pending_review",
      visible: true,
      propertyFeatureID: globalFeature.id,
      userID: userId,
    };

    try {
      const resp = await API.graphql(graphqlOperation(createDocument, { input }));
      return resp?.data?.createDocument || null;
    } catch (err) {
      console.error("Error creando Document en DB (PropertyDocumentation):", err);
      return null;
    }
  };

  // Extraer S3 key desde URL
  const extractKeyFromUrl = (url) => {
    try {
      const u = new URL(url);
      // https://bucket.s3.amazonaws.com/<KEY>
      return decodeURIComponent(u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname);
    } catch {
      return null;
    }
  };

  // Función helper para detectar si un archivo es visualizable (PDF o imagen)
  const isVisualizableFile = (url) => {
    if (!url) return false;
    const urlLower = url.toLowerCase();
    const visualizableExtensions = [
      '.pdf',
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'
    ];
    return visualizableExtensions.some(ext => urlLower.includes(ext));
  };

  // Función para abrir el modal de visualización
  const handleViewDocument = (
    url,
    name,
    documentId = null,
    typeCode = null,
    { allowed = true, blockedMessage } = {}
  ) => {
    if (!allowed) {
      Swal.fire({
        title: "Visualización no disponible",
        text:
          blockedMessage ||
          "No tienes permisos para visualizar este documento.",
        icon: "info",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#6e6c35",
      });
      return;
    }

    if (isVisualizableFile(url)) {
      setViewerDocumentUrl(url);
      setViewerDocumentName(name);
      setViewerDocumentId(documentId);
      setViewerDocumentType(typeCode);
      setViewerModalOpen(true);
    } else {
      // Si no es visualizable, abrir en nueva pestaña
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Eliminar archivo en S3 y registro en DB
  const deleteFileAndRecord = async ({ s3Key, documentId }) => {
    try {
      Swal.fire({
        title: "Eliminando documento...",
        text: "Por favor espera mientras se elimina el archivo",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      // 1) Borrar en S3 si hay key
      if (s3Key) {
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));
      }

      // 2) Borrar registro en DB si hay id
      if (documentId) {
        await API.graphql(graphqlOperation(deleteDocument, { input: { id: documentId } }));
      }

      Swal.close();
      toast.success("Documento eliminado");
      
      // Refrescar los datos del predio para que se vean en otros tabs
      if (refreshPropertyData) {
        await refreshPropertyData();
      }
    } catch (err) {
      console.error("Error eliminando documento:", err);
      Swal.fire({
        title: "Error al eliminar",
        text: "No fue posible eliminar el documento. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      throw err;
    }
  };

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

    const rawUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
    const fileUrl = encodeURI(rawUrl);
    return { url: fileUrl, key: fileKey };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleRequiredDocUpload = async (docId, file) => {
    if (!file) return;

    const docConfig = requiredDocuments.find((doc) => doc.id === docId);
    if (docConfig && !canUploadRequiredDoc(docConfig)) {
      showUploadPermissionError(getBlockedDocMessage(docConfig));
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

      const uploaded = await uploadFileToS3(file, "required", docId);

      // Guardar en DB
      const typeCode = mapRequiredIdToTypeCode(docId);
      const created = await saveDocumentToDB({ url: uploaded.url, name: file.name, typeCode, s3Key: uploaded.key });
      
      setRequiredDocs(prev => ({
        ...prev,
        [docId]: {
          file: file,
          url: uploaded.url,
          name: file.name,
          uploadedAt: new Date().toISOString(),
          status: 'pending_review',
          documentId: created?.id || null,
          s3Key: uploaded.key,
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

      // Refrescar los datos del predio para que se vean en otros tabs
      if (refreshPropertyData) {
        await refreshPropertyData();
      }

    } catch (error) {
      console.error("Error uploading required document:", error);
      showUploadError(error);
    }
  };

  const triggerFileUpload = (docId) => {
    const docConfig = requiredDocuments.find((doc) => doc.id === docId);
    if (docConfig && !canUploadRequiredDoc(docConfig)) {
      showUploadPermissionError(getBlockedDocMessage(docConfig));
      return;
    }

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
    
    const docConfig = requiredDocuments.find((doc) => doc.id === docId);
    if (docConfig && !canUploadRequiredDoc(docConfig)) {
      showUploadPermissionError(getBlockedDocMessage(docConfig));
      return;
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

  const handleAdditionalDocUpload = async (file) => {
    if (!canUploadAdditionalDocs) {
      showUploadPermissionError();
      return;
    }

    if (!file) {
      Swal.fire({
        title: "Archivo requerido",
        text: "Por favor selecciona un archivo para subir",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#8B4513",
      });
      return;
    }

    try {
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

      const uploaded = await uploadFileToS3(file, "additional");
      
      const newDoc = {
        id: Date.now(),
        type: "Documento adicional",
        file,
        url: uploaded.url,
        name: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending_review',
      };

      // Guardar en DB
      const created = await saveDocumentToDB({ url: uploaded.url, name: file.name, typeCode: "OTRO", s3Key: uploaded.key });
      newDoc.documentId = created?.id || null;
      newDoc.s3Key = uploaded.key;

      setAdditionalDocs(prev => [...prev, newDoc]);
      setHasUnsavedChanges(true);
      
      Swal.fire({
        title: "¡Documento Agregado!",
        text: "El documento adicional ha sido subido exitosamente",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      // Refrescar los datos del predio para que se vean en otros tabs
      if (refreshPropertyData) {
        await refreshPropertyData();
      }

    } catch (error) {
      console.error("Error uploading additional document:", error);
      showUploadError(error);
    }
  };

  const triggerAdditionalUpload = () => {
    if (!canUploadAdditionalDocs) {
      showUploadPermissionError();
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        handleAdditionalDocUpload(file);
      }
    };
    input.click();
  };

  const handleDropAdditional = (e) => {
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
    if (!canUploadAdditionalDocs) {
      showUploadPermissionError();
      return;
    }

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        handleAdditionalDocUpload(file);
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

  const removeRequiredDoc = async (docId) => {
    const current = requiredDocs[docId];
    const s3Key = current?.s3Key || extractKeyFromUrl(current?.url);
    const documentId = current?.documentId;
    await deleteFileAndRecord({ s3Key, documentId });
    setRequiredDocs(prev => ({ ...prev, [docId]: null }));
    setHasUnsavedChanges(true);
  };

  const removeAdditionalDoc = async (docId) => {
    const doc = additionalDocs.find(d => d.id === docId);
    const s3Key = doc?.s3Key || extractKeyFromUrl(doc?.url);
    const documentId = doc?.documentId;
    await deleteFileAndRecord({ s3Key, documentId });
    setAdditionalDocs(prev => prev.filter(d => d.id !== docId));
    setHasUnsavedChanges(true);
  };

  const getColorClasses = (color) => {
    // Usar colores de Terrasacha según terrasacha-design.json
    const colorMap = {
      red: "bg-[#b1c181]/20 text-[#6e6c35] border-[#849b50]/30 hover:bg-[#b1c181]/30",
      blue: "bg-[#b1c181]/20 text-[#6e6c35] border-[#849b50]/30 hover:bg-[#b1c181]/30",
      green: "bg-[#b1c181]/20 text-[#6e6c35] border-[#849b50]/30 hover:bg-[#b1c181]/30",
      purple: "bg-[#b1c181]/20 text-[#6e6c35] border-[#849b50]/30 hover:bg-[#b1c181]/30",
    };
    return colorMap[color] || "bg-[#b1c181]/20 text-[#6e6c35] border-[#849b50]/30 hover:bg-[#b1c181]/30";
  };

  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {isConsultant && (
        <div
          className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-xl p-4 sm:p-5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <FaLock
              className="text-[#6e6c35] text-lg mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h4 className="text-sm font-semibold text-[#6e6c35] font-typographica mb-1">
                Modo consulta — acceso restringido
              </h4>
              <p className="text-xs sm:text-sm text-[#6e6c35] font-typographica mb-0 opacity-90">
                Puedes ver el estado de todos los documentos. Solo el Memorando
                de Entendimiento está disponible para abrir y gestionar. El
                Certificado de Libertad, Escrituras y Planos Catastrales los
                revisa el rol legal.
              </p>
            </div>
          </div>
        </div>
      )}

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
            const isReadOnly = !canUploadRequiredDoc(doc);
            const canViewDoc = canViewRequiredDoc(doc);
            
            return (
              <div
                key={doc.id}
                data-doc-id={doc.id}
                className={`group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 ease-in-out transform relative flex items-center justify-center min-h-[280px] ${
                  isUploaded
                    ? "border-terrasacha-primary bg-terrasacha-primary/5"
                    : isReadOnly
                    ? "border-dashed border-terrasacha-light bg-terrasacha-light/5 opacity-80"
                    : "border-dashed border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 hover:scale-102 hover:shadow-md"
                }`}
                onDragOver={isReadOnly ? undefined : handleDragOver}
                onDragEnter={isReadOnly ? undefined : handleDragEnter}
                onDragLeave={isReadOnly ? undefined : handleDragLeave}
                onDrop={isReadOnly ? undefined : (e) => handleDrop(e, doc.id)}
                onMouseEnter={() => isReadOnly && setHoveredBlockedDoc(doc.id)}
                onMouseLeave={() => setHoveredBlockedDoc(null)}
              >
                {/* Tooltip para documentos bloqueados */}
                {isReadOnly && hoveredBlockedDoc === doc.id && (
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <div className="bg-[#44482c] text-white text-xs sm:text-sm rounded-lg p-3 sm:p-4 shadow-xl max-w-[90%] mx-auto border border-[#6e6c35] animate-fade-in">
                      <div className="flex items-start space-x-2">
                        <FaLock className="text-[#e8d79a] text-base sm:text-lg mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div>
                          <p className="font-semibold font-typographica mb-1">Carga no disponible</p>
                          <p className="font-typographica opacity-90">
                            {getBlockedDocMessage(doc)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay de "Suelta aquí" cuando se arrastra */}
                {draggedOverCard === doc.id && !isUploaded && !isReadOnly && (
                  <div className="absolute inset-0 bg-[#6e6c35]/90 rounded-xl flex items-center justify-center z-10">
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
                  <div className="text-center w-full flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#849b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                        {doc.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3">
                        {isUploaded.name}
                      </p>
                      <div className="text-xs text-terrasacha-secondary1 font-typographica mb-2">
                        Subido: {new Date(isUploaded.uploadedAt).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        {canViewDoc ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleViewDocument(
                                isUploaded.url,
                                isUploaded.name,
                                isUploaded.documentId,
                                isUploaded.typeCode ||
                                  mapRequiredIdToTypeCode(doc.id),
                                { allowed: true }
                              )
                            }
                            className="px-3 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica text-xs sm:text-sm transition-colors"
                            aria-label={`Ver ${doc.name}`}
                          >
                            Ver
                          </button>
                        ) : (
                          <span
                            className="px-3 py-1 text-terrasacha-secondary1/70 font-typographica text-xs sm:text-sm flex items-center gap-1"
                            title={getViewBlockedMessage(doc)}
                            aria-label={getViewBlockedMessage(doc)}
                          >
                            <FaLock className="text-xs" aria-hidden="true" />
                            Solo legal
                          </span>
                        )}
                        {canUploadRequiredDoc(doc) && (
                          <button
                            type="button"
                            onClick={() => removeRequiredDoc(doc.id)}
                            className="px-3 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica text-xs sm:text-sm"
                            aria-label={`Eliminar ${doc.name}`}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Estado del documento en la parte inferior */}
                    <div className="mt-auto">
                      {isUploaded.isApproved || isUploaded.status === 'approved' ? (
                        <div className="bg-[#b1c181]/20 border border-[#849b50] rounded-lg p-2">
                          <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                            ✓ Aprobado
                          </p>
                        </div>
                      ) : isUploaded.status === 'rejected' || isUploaded.status === 'rechazado' ? (
                        <div className="bg-[#44482c]/10 border border-[#44482c] rounded-lg p-2">
                          <div className="flex items-center justify-center gap-1.5 mb-1.5">
                            <span className="text-[#44482c] text-sm">✗</span>
                            <p className="text-xs text-[#44482c] font-semibold font-typographica mb-0">
                              Rechazado
                            </p>
                          </div>
                          <p className="text-xs text-[#44482c] font-typographica mb-2 text-center">
                            Sube una nueva versión corregida
                          </p>
                          {!isReadOnly && (
                            <button
                              onClick={() => triggerFileUpload(doc.id)}
                              className="w-full bg-[#44482c] hover:bg-[#6e6c35] text-white font-semibold py-1.5 px-3 rounded transition-colors font-typographica text-xs flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Volver a Subir
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#e8d79a]/20 border border-[#e8d79a] rounded-lg p-2">
                          <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0">
                            ⏳ En proceso de revisión
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`text-center w-full ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => {
                      if (isReadOnly) {
                        showUploadPermissionError(getBlockedDocMessage(doc));
                        return;
                      }
                      triggerFileUpload(doc.id);
                    }}
                    role="button"
                    tabIndex={isReadOnly ? -1 : 0}
                    aria-disabled={isReadOnly}
                    aria-label={
                      isReadOnly
                        ? `${doc.name} — solo lectura`
                        : `Subir ${doc.name}`
                    }
                    onKeyDown={(e) => {
                      if (isReadOnly) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        triggerFileUpload(doc.id);
                      }
                    }}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getColorClasses(doc.color)} rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto ${!isReadOnly ? 'group-hover:scale-110 transition-transform' : 'opacity-60'}`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                      {doc.name} {!isReadOnly && <span className="text-[#849b50]">*</span>}
                    </h4>
                    <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-3">
                      {doc.description}
                    </p>
                    {isReadOnly ? (
                      <div className="bg-[#b1c181]/10 border border-[#849b50]/30 rounded-lg p-2 mb-3">
                        <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0 flex items-center justify-center gap-1.5">
                          <FaLock className="text-xs" aria-hidden="true" />
                          {isConsultant && !doc.consultantOnly
                            ? "Pendiente por propietario"
                            : "Solo lectura"}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#849b50]/20 border border-[#849b50] rounded-lg p-2 mb-3">
                        <p className="text-xs text-[#849b50] font-semibold font-typographica mb-0">
                          ⚠️ Requerido
                        </p>
                      </div>
                    )}
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
            Sube documentación adicional de forma opcional. Puedes agregar tantos como necesites.
          </p>
        </div>

        {/* Grid de documentos adicionales: subidos + card para agregar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cards ya subidos */}
          {additionalDocs.map((doc) => (
            <div
              key={doc.id}
              className="group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 ease-in-out transform relative border-terrasacha-primary bg-terrasacha-primary/5 flex items-center justify-center min-h-[280px]"
            >
              <div className="text-center w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <FaFileAlt className="w-6 h-6 sm:w-8 sm:h-8 text-[#849b50]" />
                </div>
                <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                  Documento adicional
                </h4>
                <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2 sm:mb-3 break-all">
                  {doc.name}
                </p>
                <div className="text-xs text-terrasacha-secondary1 font-typographica mb-3">
                  Subido: {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                </div>
                <div className="flex items-center justify-center space-x-3">
                  {canViewAdditionalDocs ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDocument(
                          doc.url,
                          doc.name,
                          doc.documentId,
                          doc.typeCode,
                          { allowed: true }
                        )
                      }
                      className="px-3 py-1 text-terrasacha-primary hover:bg-terrasacha-primary/10 rounded font-typographica text-xs sm:text-sm transition-colors"
                      aria-label={`Ver documento adicional ${doc.name}`}
                    >
                      Ver
                    </button>
                  ) : (
                    <span
                      className="px-3 py-1 text-terrasacha-secondary1/70 font-typographica text-xs sm:text-sm flex items-center gap-1"
                      title="Este documento solo puede ser visualizado por el revisor legal."
                      aria-label="Visualización no disponible para consultor"
                    >
                      <FaLock className="text-xs" aria-hidden="true" />
                      Solo legal
                    </span>
                  )}
                  {canUploadAdditionalDocs && (
                    <button
                      type="button"
                      onClick={() => removeAdditionalDoc(doc.id)}
                      className="px-3 py-1 text-[#44482c] hover:bg-[#44482c]/10 rounded font-typographica text-xs sm:text-sm"
                      aria-label={`Eliminar documento adicional ${doc.name}`}
                    >
                      <FaTrash className="inline mr-1" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Card para agregar nuevo documento */}
          <div
            data-doc-id="additional"
            className={`group p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 ease-in-out transform relative border-dashed flex items-center justify-center min-h-[280px] ${
              canUploadAdditionalDocs
                ? "border-terrasacha-light hover:border-terrasacha-primary hover:bg-terrasacha-primary/5 hover:scale-102 hover:shadow-md cursor-pointer"
                : "border-terrasacha-light bg-terrasacha-light/5 opacity-80 cursor-not-allowed"
            }`}
            onClick={() => {
              if (!canUploadAdditionalDocs) {
                showUploadPermissionError();
                return;
              }
              triggerAdditionalUpload();
            }}
            onDragOver={canUploadAdditionalDocs ? handleDragOver : undefined}
            onDragEnter={canUploadAdditionalDocs ? handleDragEnter : undefined}
            onDragLeave={canUploadAdditionalDocs ? handleDragLeave : undefined}
            onDrop={canUploadAdditionalDocs ? handleDropAdditional : undefined}
            role="button"
            tabIndex={canUploadAdditionalDocs ? 0 : -1}
            aria-disabled={!canUploadAdditionalDocs}
            aria-label={
              canUploadAdditionalDocs
                ? "Agregar documento adicional"
                : "Agregar documento adicional — solo lectura"
            }
            onKeyDown={(e) => {
              if (!canUploadAdditionalDocs) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerAdditionalUpload();
              }
            }}
          >
            {/* Overlay de "Suelta aquí" */}
            {draggedOverCard === 'additional' && canUploadAdditionalDocs && (
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
                    Para subir documento adicional
                  </p>
                </div>
              </div>
            )}

            <div className="text-center w-full">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-[#b1c181]/20 text-[#6e6c35] border border-[#849b50]/30 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto ${canUploadAdditionalDocs ? 'group-hover:scale-110 transition-transform' : 'opacity-60'}`}>
                {canUploadAdditionalDocs ? (
                  <FaPlus className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <FaLock className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                )}
              </div>
              <h4 className="text-sm sm:text-lg font-semibold text-terrasacha-primary font-typographica mb-2">
                Agregar documento adicional
              </h4>
              <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-2">
                {canUploadAdditionalDocs
                  ? "Haz clic o arrastra un archivo (PDF, JPG, JPEG, PNG)"
                  : "La carga de documentos adicionales solo puede ser realizada por el propietario del predio."}
              </p>
              {!canUploadAdditionalDocs && (
                <div className="bg-[#b1c181]/10 border border-[#849b50]/30 rounded-lg p-2">
                  <p className="text-xs text-[#6e6c35] font-semibold font-typographica mb-0 flex items-center justify-center gap-1.5">
                    <FaLock className="text-xs" aria-hidden="true" />
                    Solo lectura
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de visualización de documentos */}
      <DocumentViewerModal
        isOpen={viewerModalOpen}
        onClose={() => {
          setViewerModalOpen(false);
          setViewerDocumentUrl(null);
          setViewerDocumentName(null);
          setViewerDocumentId(null);
          setViewerDocumentType(null);
        }}
        documentUrl={viewerDocumentUrl}
        documentName={viewerDocumentName}
        documentId={viewerDocumentId}
        documentType={viewerDocumentType}
        propertyData={propertyData}
        refreshPropertyData={refreshPropertyData}
      />
    </div>
  );
}
