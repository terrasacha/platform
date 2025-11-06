import React, { useState, useEffect } from "react";
import vacio from "../views/_images/caja-vacia-gris.png";
import HeaderNavbar from "components/Investor/Navbars/HeaderNavbar";
import { API, Auth, graphqlOperation } from "aws-amplify";
import useFetchProperties from "hooks/useFetchProperties";
import { useNavigate } from "react-router";
import { formatArea } from "components/Constructor/ProjectPage/mappers";
import { stateMapper } from "utilities/propertyStateMapper";
import { useAuth } from "context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import {
  createNotification,
  createVerificationComment,
  updateProperty,
  updateVerification,
  updateDocument,
} from "graphql/mutations";
import PropertyChat from "components/Legal/PropertyChat";
import {
  FaEye,
  FaUserPlus,
  FaUserMinus,
  FaInfoCircle,
  FaGavel,
} from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Row } from "react-bootstrap";

const documentTypeMapper = {
  // Tipos originales (por compatibilidad)
  CERTIFICADO_TRADICION: "Certificado de Tradición",
  ESCRITURA_PUBLICA: "Escritura Pública",
  PLANO_CATASTRAL: "Plano Catastral",

  // Tipos que realmente están guardados en la base de datos
  CERTIFICADO: "Certificado de Tradición",
  ESCRITURAS: "Escritura Pública",
  PLANOS: "Plano Catastral",

  // Tipos adicionales que podrían existir
  CERTIFICADO_TRADICION: "Certificado de Tradición",
  ESCRITURA: "Escritura Pública",
  PLANO: "Plano Catastral",
};

const getPropertyArea = (property) => {
  const areaFeature = property.propertyFeatures?.items.find(
    (feature) => feature?.featureID === "D_area"
  );
  if (!areaFeature) return "-";
  return parseFloat(areaFeature?.value).toLocaleString("es-ES");
};

const DocumentationModal = ({
  isOpen,
  onClose,
  property,
  fetchProperties,
  user,
}) => {
  const [showRejectionReasonModal, setShowRejectionReasonModal] =
    useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [additionalDocuments, setAdditionalDocuments] = useState([]);
  const [owners, setOwners] = useState([]);

  // Tipos de documentos requeridos (igual que en PropertyDocumentation.jsx)
  const requiredDocumentTypes = [
    "CERTIFICADO_TRADICION",
    "ESCRITURA_PUBLICA",
    "PLANO_CATASTRAL",
  ];

  // Tipos de documentos relacionados con propietarios que NO deben aparecer
  const notToShowDocuments = [
    "OWNER_BUNDLE",
    "USER_ID_FRONT",
    "USER_ID_BACK",
    "USER_SELFIE",
    "OWNER_INFO",
    "OWNER_RELATION",
    "MEMORANDO_ENTENDIMIENTO",
  ];

  // Mapeo de tipos de código a nombre legible
  const mapTypeCodeToName = (typeCode) => {
    const map = {
      CERTIFICADO_TRADICION: "Certificado de Libertad y Tradición",
      ESCRITURA_PUBLICA: "Escrituras Públicas",
      PLANO_CATASTRAL: "Planos Catastrales",
      MEMORANDO_ENTENDIMIENTO: "Memorando de Entendimiento",
      OTRO: "Documento adicional",
    };
    return map[typeCode] || "Documento adicional";
  };

  // Cargar documentos y propietarios desde propertyFeatures
  useEffect(() => {
    if (!property?.propertyFeatures?.items) return;

    const globalFeature = property.propertyFeatures.items.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );

    const allDocs = globalFeature?.documents?.items || [];
    const required = [];
    const additional = [];
    const ownersList = [];

    // Obtener todos los documentos de todos los features para buscar propietarios
    const allFeaturesDocs = property.propertyFeatures.items.flatMap(
      (feature) => feature?.documents?.items || []
    );

    // Primero, crear un mapa de documentos cargados por tipo
    const loadedDocumentsByType = {};

    allFeaturesDocs.forEach((document) => {
      let data = {};
      try {
        data = JSON.parse(document.data || "{}");
      } catch {
        data = {};
      }

      const typeCode = data.type || "OTRO";

      // Procesar propietarios (OWNER_BUNDLE)
      if (typeCode === "OWNER_BUNDLE") {
        const ownerInfo = {
          id: document.id,
          ownerId: data.ownerId || document.id,
          name: data.name || "Sin nombre",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "PROPIETARIO",
          status: document.status || "pending_review",
          isApproved: document.isApproved || false,
          files: data.files || [], // Array de archivos (idFront, idBack, selfie)
          createdAt:
            document.createdAt || document.timeStamp
              ? new Date(document.timeStamp * 1000).toISOString()
              : new Date().toISOString(),
        };
        ownersList.push(ownerInfo);
        return; // No agregar a documentos
      }

      // Excluir documentos relacionados con propietarios
      if (notToShowDocuments.includes(typeCode)) {
        return;
      }

      // Solo procesar documentos del GLOBAL_PROPERTY_FILES
      if (!allDocs.includes(document)) {
        return;
      }

      const docInfo = {
        id: document.id,
        name: data.name || document.id,
        url: data.url || document.url,
        type: typeCode,
        typeName: mapTypeCodeToName(typeCode),
        status: document.status || "pending_review",
        isApproved: document.isApproved || false,
        createdAt:
          document.createdAt || document.timeStamp
            ? new Date(document.timeStamp * 1000).toISOString()
            : new Date().toISOString(),
      };

      if (requiredDocumentTypes.includes(typeCode)) {
        loadedDocumentsByType[typeCode] = docInfo;
        required.push(docInfo);
      } else {
        additional.push(docInfo);
      }
    });

    // Agregar documentos requeridos que no se han cargado aún
    requiredDocumentTypes.forEach((typeCode) => {
      if (!loadedDocumentsByType[typeCode]) {
        required.push({
          id: `not_uploaded_${typeCode}`, // ID temporal para documentos no cargados
          name: "",
          url: null,
          type: typeCode,
          typeName: mapTypeCodeToName(typeCode),
          status: "not_uploaded",
          isApproved: false,
          createdAt: null,
        });
      }
    });

    setRequiredDocuments(required);
    setAdditionalDocuments(additional);
    setOwners(ownersList);
  }, [property]);

  // Manejar aprobación/rechazo de documento
  const handleDocumentStatus = async (documentId, status, reason = "") => {
    try {
      const input = {
        id: documentId,
        status: status === "approved" ? "approved" : "rejected",
        isApproved: status === "approved",
      };

      await API.graphql(graphqlOperation(updateDocument, { input }));

      // Actualizar estado local para documentos
      setRequiredDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? { ...doc, status: input.status, isApproved: input.isApproved }
            : doc
        )
      );

      toast.success(
        `Documento ${
          status === "approved" ? "aprobado" : "rechazado"
        } exitosamente`
      );
      fetchProperties();
    } catch (error) {
      console.error("Error actualizando documento:", error);
      toast.error("Error al actualizar el documento");
    }
    setShowRejectionReasonModal(false);
    setSelectedDocumentId(null);
  };

  // Manejar aprobación/rechazo de propietario
  const handleOwnerStatus = async (ownerId, status, reason = "") => {
    try {
      const input = {
        id: ownerId,
        status: status === "approved" ? "approved" : "rejected",
        isApproved: status === "approved",
      };

      await API.graphql(graphqlOperation(updateDocument, { input }));

      // Actualizar estado local para propietarios
      setOwners((prev) =>
        prev.map((owner) =>
          owner.id === ownerId
            ? { ...owner, status: input.status, isApproved: input.isApproved }
            : owner
        )
      );

      toast.success(
        `Propietario ${
          status === "approved" ? "aprobado" : "rechazado"
        } exitosamente`
      );
      fetchProperties();
    } catch (error) {
      console.error("Error actualizando propietario:", error);
      toast.error("Error al actualizar el propietario");
    }
    setShowRejectionReasonModal(false);
    setSelectedDocumentId(null);
  };

  const handleEligible = async (option, reason = "") => {
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: property.id,
            status: option ? "SELECTABLE" : "NOT_SELECTABLE",
            reason: option ? null : reason,
          },
        })
      );

      // Si se rechaza, también deja un mensaje en el chat del predio
      if (!option && reason.trim()) {
        // ✅ CORREGIDO: Usar el primer feature GLOBAL_PROPERTY_FILES encontrado
        const firstGlobalFilesFeature = property.propertyFeatures.items.find(
          (f) => f.featureID === "GLOBAL_PROPERTY_FILES"
        );

        if (firstGlobalFilesFeature?.verifications?.items?.[0]?.id) {
          await API.graphql(
            graphqlOperation(createVerificationComment, {
              input: {
                verificationID:
                  firstGlobalFilesFeature.verifications.items[0].id,
                comment: `Predio marcado como No Elegible. Razón: ${reason}`,
                isCommentByVerifier: true,
              },
            })
          );
        }
      }

      const notificationMessage = option
        ? `Tu predio '${property.name}' ha sido aprobado como 'Elegible'.`
        : `Tu predio '${property.name}' ha sido marcado como 'No Elegible'.`;

      const notificationData = {
        userOriginID: user.id,
        userID: property.userID,
        message: notificationMessage,
        type: "PROPERTY",
        resourceID: property.id,
        isRead: false,
      };

      await API.graphql(
        graphqlOperation(createNotification, { input: notificationData })
      );

      toast.success(
        `El estado del predio ahora es: ${option ? "Elegible" : "No elegible"}`
      );
      fetchProperties();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
      console.log("error", error);
    }
    onClose();
  };

  const getStatusBadge = (status, isApproved) => {
    if (isApproved || status === "approved") {
      return (
        <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold font-typographica">
          ✓ Aprobado
        </span>
      );
    }
    if (status === "rejected" || status === "rechazado") {
      return (
        <span className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-xs font-semibold font-typographica">
          ✗ Rechazado
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold font-typographica">
        ⏳ Pendiente
      </span>
    );
  };

  // Verificar si todos los documentos requeridos y propietarios están validados
  const areAllValidated = () => {
    if (owners.length === 0) {
      return false;
    }

    const allOwnersValidated =
      owners.length === 0 ||
      owners.every((owner) => owner.isApproved || owner.status === "approved");

    const allDocumentsValidated =
      requiredDocuments.length === 0 ||
      requiredDocuments.every(
        (doc) => doc.isApproved || doc.status === "approved"
      );

    return allOwnersValidated && allDocumentsValidated;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto p-2">
      <div className="bg-white rounded-lg p-3 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-terrasacha-primary font-typographica">
            Revisión de Documentación
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Columna 1: Validación de Identificación */}
          <div className="space-y-3">
            {owners.length > 0 ? (
              <div className="bg-white border border-terrasacha-light/20 rounded-lg p-3">
                <h3 className="text-sm font-bold text-terrasacha-primary font-typographica mb-2">
                  Validación de Identificación
                </h3>
                <div className="space-y-2">
                  {owners.map((owner) => (
                    <div
                      key={owner.id}
                      className="border border-terrasacha-light/20 rounded-lg p-2 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Columna izquierda: Información */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0.5">
                              {owner.name}
                            </h4>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-0.5">
                              {owner.email}
                            </p>
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                              {owner.phone}
                            </p>
                            <p className="text-xs text-gray-500 font-typographica mb-1">
                              {owner.role === "POSTULANTE"
                                ? "Postulante"
                                : "Propietario"}
                            </p>
                            {getStatusBadge(owner.status, owner.isApproved)}
                          </div>

                          {/* Columna derecha: Adjuntos */}
                          <div className="flex flex-col">
                            <p className="text-xs font-semibold text-terrasacha-primary font-typographica mb-1">
                              Documentos Adjuntos
                            </p>
                            {owner.files && owner.files.length > 0 ? (
                              <div className="space-y-1.5">
                                {owner.files.map((file, idx) => (
                                  <a
                                    key={idx}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-terrasacha-primary hover:text-terrasacha-primary/80 hover:underline font-typographica p-1.5 border border-terrasacha-light/20 rounded hover:bg-terrasacha-light/5 transition-colors"
                                  >
                                    <span>
                                      {file.type === "USER_ID_FRONT"
                                        ? "📄"
                                        : file.type === "USER_ID_BACK"
                                        ? "📄"
                                        : file.type === "USER_SELFIE"
                                        ? "📷"
                                        : "📎"}
                                    </span>
                                    <span>
                                      {file.type === "USER_ID_FRONT"
                                        ? "Cédula Frente"
                                        : file.type === "USER_ID_BACK"
                                        ? "Cédula Reverso"
                                        : file.type === "USER_SELFIE"
                                        ? "Selfie"
                                        : "Archivo"}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic font-typographica">
                                No hay documentos adjuntos
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Botones Aprobar/Rechazar en fila completa */}
                        {owner.status === "pending_review" && (
                          <div className="flex gap-2 pt-2 border-t border-terrasacha-light/20">
                            <button
                              className="flex-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 font-typographica text-xs"
                              onClick={() =>
                                handleOwnerStatus(owner.id, "approved")
                              }
                            >
                              Aprobar
                            </button>
                            <button
                              className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 font-typographica text-xs"
                              onClick={() => {
                                setSelectedDocumentId(owner.id);
                                setShowRejectionReasonModal(true);
                              }}
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-terrasacha-light/20 rounded-lg p-3">
                <h3 className="text-sm font-bold text-terrasacha-primary font-typographica mb-2">
                  Validación de Identificación
                </h3>
                <p className="text-gray-500 italic text-center py-2 text-xs font-typographica">
                  No hay propietarios registrados
                </p>
              </div>
            )}
          </div>

          {/* Columna 2: Documentos Requeridos y Adicionales */}
          <div className="space-y-3">
            {/* Documentos Requeridos */}
            <div className="bg-white border border-terrasacha-light/20 rounded-lg p-3">
              <h3 className="text-sm font-bold text-terrasacha-primary font-typographica mb-2">
                Documentos Requeridos
              </h3>
              {requiredDocuments.length > 0 ? (
                <div className="space-y-2">
                  {requiredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-terrasacha-light/20 rounded-lg p-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0.5">
                            {doc.typeName}
                          </h4>
                          {doc.status === "not_uploaded" ? (
                            <p className="text-xs text-gray-400 font-typographica mb-1 italic">
                              Aún no se ha cargado
                            </p>
                          ) : (
                            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1 truncate">
                              {doc.name}
                            </p>
                          )}
                          {doc.status === "not_uploaded" ? (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold font-typographica">
                              No cargado
                            </span>
                          ) : (
                            getStatusBadge(doc.status, doc.isApproved)
                          )}
                        </div>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-terrasacha-primary text-white px-2 py-1 rounded hover:bg-terrasacha-primary/90 flex items-center gap-1 text-xs font-typographica ml-2 flex-shrink-0"
                          >
                            <FaEye size={10} />
                            Ver
                          </a>
                        )}
                      </div>
                      {doc.status === "pending_review" && (
                        <div className="flex gap-2 pt-2 border-t border-terrasacha-light/20">
                          <button
                            className="flex-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 font-typographica text-xs"
                            onClick={() =>
                              handleDocumentStatus(doc.id, "approved")
                            }
                          >
                            Aprobar
                          </button>
                          <button
                            className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 font-typographica text-xs"
                            onClick={() => {
                              setSelectedDocumentId(doc.id);
                              setShowRejectionReasonModal(true);
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-2 text-xs font-typographica">
                  No hay documentos requeridos subidos
                </p>
              )}
            </div>

            {/* Documentos Adicionales - Solo mostrar si hay documentos */}
            {additionalDocuments.length > 0 && (
              <div className="bg-white border border-terrasacha-light/20 rounded-lg p-3">
                <h3 className="text-sm font-bold text-terrasacha-primary font-typographica mb-2">
                  Documentos Adicionales
                </h3>
                <div className="space-y-2">
                  {additionalDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-terrasacha-light/20 rounded-lg p-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-terrasacha-primary font-typographica mb-0.5">
                            {doc.typeName}
                          </h4>
                          <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1 truncate">
                            {doc.name}
                          </p>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-terrasacha-primary text-white px-2 py-1 rounded hover:bg-terrasacha-primary/90 flex items-center gap-1 text-xs font-typographica ml-2 flex-shrink-0"
                        >
                          <FaEye size={10} />
                          Ver
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de Elegible/No Elegible */}
        <div className="mt-4 pt-4 border-t border-terrasacha-light/20">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className="relative">
                <button
                  className={`px-4 py-2 rounded font-typographica text-sm font-semibold transition-colors ${
                    areAllValidated()
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => handleEligible(true)}
                  disabled={!areAllValidated()}
                  data-tooltip-id={`tooltip-elegible-${
                    property?.id || "default"
                  }`}
                  data-tooltip-content={
                    !areAllValidated()
                      ? "Deben ser aprobados todos los documentos y validaciones de identidad para poder ser Elegible"
                      : ""
                  }
                >
                  Elegible
                </button>
                {!areAllValidated() && (
                  <ReactTooltip
                    id={`tooltip-elegible-${property?.id || "default"}`}
                    place="top"
                    effect="solid"
                  />
                )}
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-typographica text-sm font-semibold hover:bg-red-600 transition-colors"
                onClick={() => {
                  // Mostrar modal para razón de rechazo
                  setShowRejectionReasonModal(true);
                  setSelectedDocumentId("NO_ELEGIBLE"); // Identificador especial para marcar como no elegible
                }}
              >
                No Elegible
              </button>
            </div>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-typographica text-sm font-semibold hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Modal de razón de rechazo */}
      {showRejectionReasonModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg">
            <h3 className="text-sm font-semibold mb-3 font-typographica">
              {selectedDocumentId === "NO_ELEGIBLE"
                ? "Motivo de No Elegible"
                : "Motivo de Rechazo"}
            </h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md font-typographica text-xs"
              placeholder={
                selectedDocumentId === "NO_ELEGIBLE"
                  ? "Escribe el motivo por el cual el predio no es elegible..."
                  : "Escribe el motivo por el cual se rechaza este documento..."
              }
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                className="bg-gray-300 px-3 py-1.5 rounded font-typographica text-xs"
                onClick={() => {
                  setShowRejectionReasonModal(false);
                  setSelectedDocumentId(null);
                  setRejectionReason("");
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 font-typographica text-xs"
                onClick={() => {
                  // Si es para marcar como no elegible, usar handleEligible
                  if (selectedDocumentId === "NO_ELEGIBLE") {
                    if (!rejectionReason.trim()) {
                      toast.error(
                        "Debes ingresar una razón para marcar como no elegible"
                      );
                      return;
                    }
                    handleEligible(false, rejectionReason);
                    setRejectionReason("");
                    return;
                  }

                  // Si es para rechazar un documento o propietario
                  if (!rejectionReason.trim()) {
                    toast.error("Debes ingresar una razón");
                    return;
                  }
                  // Determinar si es un propietario o un documento
                  const isOwner = owners.some(
                    (o) => o.id === selectedDocumentId
                  );
                  if (isOwner) {
                    handleOwnerStatus(
                      selectedDocumentId,
                      "rejected",
                      rejectionReason
                    );
                  } else {
                    handleDocumentStatus(
                      selectedDocumentId,
                      "rejected",
                      rejectionReason
                    );
                  }
                  setRejectionReason("");
                }}
              >
                {selectedDocumentId === "NO_ELEGIBLE"
                  ? "Confirmar No Elegible"
                  : "Confirmar Rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente principal que muestra la lista de campañas
export default function LegalAdmon() {
  const { isLoading, properties, fetchProperties } = useFetchProperties();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const { user } = useAuth();

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLegal, setFilterLegal] = useState("");

  const navigate = useNavigate();

  async function logOut() {
    await Auth.signOut();
    localStorage.removeItem("role"); // Eliminar el rol del localStorage
    navigate("/"); // Redirigir a la página principal
  }

  const handleOpenModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleToggleAssign = async (property) => {
    // ✅ CORREGIDO: Buscar el primer feature GLOBAL_PROPERTY_FILES y verificar que tenga verificaciones
    const firstGlobalFilesFeature = property?.propertyFeatures?.items.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );

    if (!firstGlobalFilesFeature?.verifications?.items?.[0]?.id) {
      toast.error("No se encontró verificación para este predio");
      return;
    }

    const propertyVerificationID =
      firstGlobalFilesFeature.verifications.items[0].id;

    if (property.userLegal !== null) {
      if (property.userLegalID === user.id) {
        // Si el usuario legal es el mismo que el usuario logueado, desasignar
        try {
          await API.graphql(
            graphqlOperation(updateProperty, {
              input: {
                id: property.id,
                userLegalID: null, // Desasignar el usuario legal
              },
            })
          );

          const notificationData = {
            userOriginID: user.id, // Usuario que hace la asignación
            userID: property.userID, // Dueño del predio
            message: `El revisor legal ya no está asignado a tu predio '${property.name}'.`,
            type: "PROPERTY",
            resourceID: property.id, // ID del predio
            isRead: false,
          };

          await API.graphql(
            graphqlOperation(createNotification, { input: notificationData })
          );

          toast.success(`Predio desasignado`);
          fetchProperties();
        } catch (error) {
          toast.error("Error al actualizar el estado del predio");
        }

        return; // Salir de la función después de desasignar
      } else {
        toast.error("El predio pertenece a otro legal");
        return;
      }
    }

    // Si no hay usuario legal, asignar el usuario
    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: property.id,
            userLegalID: user.id,
          },
        })
      );

      await API.graphql(
        graphqlOperation(updateVerification, {
          input: {
            id: propertyVerificationID,
            userVerifierID: user.id,
          },
        })
      );

      const notificationData = {
        userOriginID: user.id, // Usuario que hace la asignación
        userID: property.userID, // Dueño del predio
        message: `Se ha asignado un revisor legal a tu predio '${property.name}' para revisar la documentación.`,
        type: "PROPERTY",
        resourceID: property.id, // ID del predio
        isRead: false,
      };

      await API.graphql(
        graphqlOperation(createNotification, { input: notificationData })
      );

      toast.success(`Predio asignado`);
      fetchProperties();
    } catch (error) {
      toast.error("Error al actualizar el estado del predio");
    }
  };

  let filteredProperties = properties.filter(
    (property) => filterStatus === "" || property.status === filterStatus
  );

  if (filterStatus !== "") {
    filteredProperties = properties.filter(
      (property) => property.status === filterStatus
    );
  }

  // Filtrar por legal asignado
  if (filterLegal !== "") {
    filteredProperties = filteredProperties.filter(
      (property) => property.userLegalID === filterLegal
    );
  }

  // Filtrar por nombre de predio (buscador)
  const searchFilteredProperties = filteredProperties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalRows = searchFilteredProperties.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const paginatedProperties = searchFilteredProperties.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Resetear página si cambia el filtro, búsqueda o cantidad por página
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterLegal, searchTerm, rowsPerPage]);

  // Obtener lista única de legales asignados
  const uniqueLegals = [
    ...new Set(
      properties
        .filter((property) => property.userLegalID)
        .map((property) => property.userLegalID)
    ),
  ];

  return (
    <>
      <section className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold text-left text-terrasacha-primary flex-shrink-0 font-typographica">
                Listado de predios
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-1 font-typographica">
              Aquí puedes ver, filtrar y gestionar todos los predios asignados
              para revisión legal en la plataforma.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Card de Filtros */}
          <div className="bg-white rounded-t-lg shadow-lg border border-gray-100 p-6 lg:col-span-1 order-1 lg:order-1 h-[400px] lg:h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-wider flex items-center gap-2 font-typographica">
              🔍 Filtros y Búsqueda
            </h3>

            <div className="space-y-4">
              {/* Buscador */}
              <div>
                <label
                  htmlFor="searchInput"
                  className="block text-sm font-semibold text-gray-700 mb-2 font-typographica"
                >
                  Buscar predio:
                </label>
                <input
                  id="searchInput"
                  type="text"
                  placeholder="Nombre del predio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 font-typographica"
                />
              </div>

              {/* Filtro por Estado */}
              <div>
                <label
                  htmlFor="statusFilter"
                  className="block text-sm font-semibold text-gray-700 mb-2 font-typographica"
                >
                  Estado:
                </label>
                <select
                  id="statusFilter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 font-typographica"
                >
                  <option value="">Todos los estados</option>
                  {Object.keys(stateMapper).map((key) => (
                    <option key={key} value={key}>
                      {stateMapper[key].label.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Legal */}
              <div>
                <label
                  htmlFor="legalFilter"
                  className="block text-sm font-semibold text-gray-700 mb-2 font-typographica"
                >
                  Legal:
                </label>
                <select
                  id="legalFilter"
                  value={filterLegal}
                  onChange={(e) => setFilterLegal(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 font-typographica"
                >
                  <option value="">Todos los legales</option>
                  <option value="null">Sin asignar</option>
                  {uniqueLegals.map((legalId) => {
                    const legal = properties.find(
                      (p) => p.userLegalID === legalId
                    )?.userLegal;
                    return (
                      <option key={legalId} value={legalId}>
                        {(legal?.name || `Legal ${legalId}`).toUpperCase()}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Información de resultados */}
              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="text-sm text-gray-600 font-medium font-typographica">
                  Mostrando {searchFilteredProperties.length} de{" "}
                  {properties.length} predios
                </p>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 lg:col-span-3 order-2 lg:order-2">
              <svg
                className="animate-spin h-16 w-16 text-blue-500 mb-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="status"
                aria-label="Cargando predios"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-gray-500 text-lg font-medium font-typographica">
                Cargando predios...
              </p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 lg:col-span-3 order-2 lg:order-2">
              <img
                src={vacio}
                className="w-32 h-32 mb-6 opacity-60"
                alt="Sin propiedades"
              />
              <p className="text-gray-500 text-lg font-medium font-typographica">
                😔 No hay propiedades disponibles.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-t-lg shadow-xl border border-gray-100 lg:col-span-3 order-2 lg:order-2 h-[400px] lg:h-[600px] flex flex-col">
              {/* Paginación */}
              <div className="flex flex-col rounded-t-lg md:flex-row md:items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 text-end font-typographica">
                    Filas por página:
                  </span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-typographica"
                  >
                    {[5, 10, 15, 20, 30, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent font-typographica"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-700 px-3 py-1 bg-white rounded-lg border border-gray-200 font-typographica">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-all duration-200 disabled:hover:bg-transparent font-typographica"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto bg-white flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica"></th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Predio
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Descripción
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Campaña
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Fecha de inscripción
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Área (m2)
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Departamento
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Legal
                      </th>
                      <th className="text-left px-2 py-1 font-semibold text-xs font-typographica">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProperties.map((property, idx) => {
                      if (!property || !property.id) return null;
                      return (
                        <tr
                          key={property.id}
                          className={`text-xs transition-all duration-200 uppercase border-b border-gray-100 hover:bg-blue-50 hover:shadow-sm ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-25"
                          }`}
                        >
                          <td className="px-3 py-2">
                            <div className="flex justify-between items-center w-full gap-2">
                              {/* Columna 3: Ver Detalles */}
                              <div className="flex justify-center flex-1">
                                <button
                                  onClick={() =>
                                    navigate(`/property/${property.id}`)
                                  }
                                  className="border border-yellow-500 bg-yellow-500 text-white rounded-lg p-1 text-xs hover:bg-yellow-600 hover:shadow-md active:bg-yellow-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                                  aria-label="Detalles"
                                  data-tooltip-id={`tooltip-details-${property.id}`}
                                  data-tooltip-content="Ver detalles del predio"
                                >
                                  <FaInfoCircle size={13} />
                                </button>
                                <div className="hidden md:block">
                                  <ReactTooltip
                                    id={`tooltip-details-${property.id}`}
                                    place="top"
                                    effect="solid"
                                  />
                                </div>
                              </div>

                              {/* Columna 2: Revisar Documentación */}
                              <div className="flex justify-center flex-1">
                                {(() => {
                                  const canValidate =
                                    user?.id &&
                                    property.userLegalID === user.id &&
                                    property.status !== "APPROVED";
                                  return (
                                    <>
                                      <button
                                        className={`border border-blue-500 bg-blue-500 text-white rounded-lg p-1 text-xs transition-all duration-200 flex items-center justify-center w-7 h-7 ${
                                          canValidate
                                            ? "hover:bg-blue-600 hover:shadow-md active:bg-blue-700 transform hover:scale-105"
                                            : "opacity-50 cursor-not-allowed"
                                        }`}
                                        onClick={() =>
                                          canValidate &&
                                          handleOpenModal(property)
                                        }
                                        aria-label="Revisar documentación"
                                        data-tooltip-id={`tooltip-validate-${property.id}`}
                                        data-tooltip-content={
                                          canValidate
                                            ? "Revisar documentación del predio"
                                            : "No tienes permisos para revisar documentación"
                                        }
                                        disabled={!canValidate}
                                      >
                                        <FaEye size={13} />
                                      </button>
                                      <div className="hidden md:block">
                                        <ReactTooltip
                                          id={`tooltip-validate-${property.id}`}
                                          place="top"
                                          effect="solid"
                                        />
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>

                              {/* Columna 1: Asignar/Desasignar */}
                              <div className="flex justify-center flex-1">
                                {(() => {
                                  const canAssign =
                                    property.userLegalID === null &&
                                    property.status !== "REJECTED" &&
                                    property.status !== "APPROVED";
                                  const canUnassign =
                                    user?.id &&
                                    property.userLegalID === user.id &&
                                    property.status !== "REJECTED" &&
                                    property.status !== "APPROVED";

                                  if (canAssign) {
                                    return (
                                      <>
                                        <button
                                          className="border border-green-500 bg-green-500 text-white rounded-lg p-1 text-xs hover:bg-green-600 hover:shadow-md active:bg-green-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                                          onClick={() =>
                                            handleToggleAssign(property)
                                          }
                                          aria-label="Asignar predio"
                                          data-tooltip-id={`tooltip-assign-${property.id}`}
                                          data-tooltip-content="Asignar predio a mí para revisión legal"
                                        >
                                          <FaUserPlus size={13} />
                                        </button>
                                        <div className="hidden md:block">
                                          <ReactTooltip
                                            id={`tooltip-assign-${property.id}`}
                                            place="top"
                                            effect="solid"
                                          />
                                        </div>
                                      </>
                                    );
                                  } else if (canUnassign) {
                                    return (
                                      <>
                                        <button
                                          className="border border-red-500 bg-red-500 text-white rounded-lg p-1 text-xs hover:bg-red-600 hover:shadow-md active:bg-red-700 transition-all duration-200 flex items-center justify-center w-7 h-7 transform hover:scale-105"
                                          onClick={() =>
                                            handleToggleAssign(property)
                                          }
                                          aria-label="Desasignar predio"
                                          data-tooltip-id={`tooltip-unassign-${property.id}`}
                                          data-tooltip-content="Desasignar predio de mi revisión legal"
                                        >
                                          <FaUserMinus size={13} />
                                        </button>
                                        <div className="hidden md:block">
                                          <ReactTooltip
                                            id={`tooltip-unassign-${property.id}`}
                                            place="top"
                                            effect="solid"
                                          />
                                        </div>
                                      </>
                                    );
                                  }
                                  return <div className="w-7 h-7"></div>; // Espacio vacío para mantener alineación
                                })()}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-1 min-w-36 font-typographica">
                            {property.name}
                          </td>
                          <td
                            className="px-2 py-1 max-w-xs truncate font-typographica"
                            data-tooltip-id={`tooltip-description-${property.id}`}
                            data-tooltip-content={
                              property.description || "Sin descripción"
                            }
                          >
                            {property.description || "Sin descripción"}
                            <div className="hidden md:block">
                              <ReactTooltip
                                id={`tooltip-description-${property.id}`}
                                place="top"
                                effect="solid"
                                style={{
                                  maxWidth: 300,
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-word",
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-2 py-1 min-w-36 font-typographica">
                            {property.campaign?.name || "-"}
                          </td>
                          <td className="px-2 py-1 min-w-28 font-typographica">
                            {property.createdAt
                              ? new Date(property.createdAt).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )
                              : "-"}
                          </td>
                          <td className="px-2 py-1 min-w-20 font-typographica">
                            {getPropertyArea(property)}
                          </td>
                          <td className="px-2 py-1 font-typographica">
                            {property.department || "-"}
                          </td>
                          <td className="px-2 py-1 min-w-36 font-typographica">
                            {(() => {
                              const name =
                                property.userLegal?.name || "Sin Asignar";
                              const badgeColor = property.userLegal?.name
                                ? "bg-blue-100 text-blue-700 border border-blue-400"
                                : "bg-gray-200 text-gray-700 border border-gray-400";
                              return (
                                <span
                                  className={`inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase font-typographica ${badgeColor}`}
                                >
                                  {name}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-2 py-1 min-w-36 font-typographica">
                            {(() => {
                              const label =
                                stateMapper[property.status].label ||
                                "No disponible";
                              let badgeColor =
                                "bg-gray-300 text-gray-800 border border-gray-400";
                              let tooltipContent = "";
                              if (property.status === "APPROVED") {
                                badgeColor =
                                  "bg-green-100 text-green-700 border border-green-400";
                                tooltipContent =
                                  "Aprobado: El predio ha sido aprobado legalmente.";
                              } else if (
                                property.status === "REJECTED" ||
                                property.status === "NOT_SELECTABLE"
                              ) {
                                badgeColor =
                                  "bg-red-100 text-red-700 border border-red-400";
                                tooltipContent =
                                  "Rechazado/No seleccionable: El predio no cumple los requisitos legales.";
                              } else if (property.status === "PENDING") {
                                badgeColor =
                                  "bg-yellow-100 text-yellow-700 border border-yellow-400";
                                tooltipContent =
                                  "Pendiente: El predio está pendiente de revisión legal.";
                              } else if (property.status === "SELECTABLE") {
                                badgeColor =
                                  "bg-blue-100 text-blue-700 border border-blue-400";
                                tooltipContent =
                                  "Seleccionable: El predio es elegible para continuar el proceso.";
                              } else {
                                tooltipContent = label;
                              }
                              return (
                                <>
                                  <span
                                    className={`inline-block px-1 py-0 rounded text-[10px] font-semibold whitespace-nowrap uppercase font-typographica ${badgeColor}`}
                                    data-tooltip-id={`tooltip-status-${property.id}`}
                                    data-tooltip-content={tooltipContent}
                                  >
                                    {label}
                                  </span>
                                  <div className="hidden md:block">
                                    <ReactTooltip
                                      id={`tooltip-status-${property.id}`}
                                      place="top"
                                      effect="solid"
                                    />
                                  </div>
                                </>
                              );
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
      <DocumentationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
        fetchProperties={fetchProperties}
        user={user}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export { DocumentationModal };
