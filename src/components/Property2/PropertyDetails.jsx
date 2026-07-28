import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { createNotification, updateProperty } from "graphql/mutations";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { getPropertyVerificationGate } from "utilities/getPropertyVerificationGate";
import PropertyVerifyActionBar from "./PropertyVerifyActionBar";

// Componentes de formularios
import ActualUseAndPotential from "components/Constructor/Property/ActualUseAndPotential";
import UseRestrictions from "components/Property/UseRestrictions";
import Ecosystem from "components/Property/Ecosystem";
import GeneralAspects from "components/Property/GeneralAspects";
import Relations from "components/Property/Relations";
import CadastralRecords from "components/Property/CadastralRecords";
import AdditionalFiles from "components/Property/AdditionalFiles";


// --- Mapeo de roles ---
const roleMapping = {
  constructor: "Constructor",
  legal: "Revisor Legal",
  validator: "Validador",
  admon: "Administrador",
  analyst: "Analista",
};

const FEATURE_ID_MAP = {
  usoActualPotencial: [
    "D_USO_ACTUAL_POTENCIAL",
    "ACTUAL_USE_POTENTIAL",
    "D_actual_use",
  ],
  limitacionesUsoSuelo: [
    "D_LIMITACIONES_USO_SUELO",
    "USE_RESTRICTIONS",
    "E_restriccion_desc",
    "E_resctriccion_other",
  ],
  aspectosEcosistema: [
    "D_ASPECTOS_ECOSISTEMA",
    "ECOSYSTEM",
    "D_aspects_ecosystem",
    "F_nacimiento_agua",
  ],
  aspectosPredio: [
    "D_ASPECTOS_PREDIO",
    "GENERAL_ASPECTS",
    "D_aspects_property",
    "G_habita_predio",
  ],
  relacionesEntidades: [
    "D_RELACIONES_ENTIDADES",
    "RELATIONS",
    "D_relations_entities",
    "H_aliados_estrategicos_desc",
    "H_grupo_comunitario_desc",
    "H_asistance_desc",
  ],
};

const isNonEmptyValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    const v = value.trim();
    if (v.length === 0) return false;
    try {
      const parsed = JSON.parse(v);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed)) return parsed.length > 0;
        return Object.keys(parsed).length > 0;
      }
    } catch (_) {
      // string no JSON válida
    }
    return true;
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) return value.length > 0;
    return Object.keys(value).length > 0;
  }
  return true;
};

const PREDIAL_SECTIONS = [
  {
    key: "usoActualPotencial",
    label: "Uso actual y potencial",
    sectionId: "section-uso-actual",
    formName: "actualUseAndPotential",
    Component: ActualUseAndPotential,
  },
  {
    key: "limitacionesUsoSuelo",
    label: "Limitaciones de uso de suelo",
    sectionId: "section-limitaciones",
    formName: "useRestrictions",
    Component: UseRestrictions,
  },
  {
    key: "aspectosEcosistema",
    label: "Aspectos generales del ecosistema",
    sectionId: "section-ecosistema",
    formName: "ecosystem",
    Component: Ecosystem,
  },
  {
    key: "aspectosPredio",
    label: "Aspectos generales del predio",
    sectionId: "section-aspectos-predio",
    formName: "generalAspects",
    Component: GeneralAspects,
  },
  {
    key: "relacionesEntidades",
    label: "Relaciones con entidades y aliados estratégicos",
    sectionId: "section-relaciones",
    formName: "relations",
    Component: Relations,
  },
];

export default function PropertyDetails({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
}) {
  const { propertyData, refresh } = usePropertyData();
  // Envolver handleFieldChange para refrescar propertyData después de guardar
  const handleFieldChangeWithRefresh = async (...args) => {
    try {
      const maybePromise = handleFieldChange ? handleFieldChange(...args) : undefined;
      await Promise.resolve(maybePromise);
    } finally {
      try {
        await refresh();
      } catch (e) {
        console.error("Error al refrescar propertyData:", e);
      }
    }
  };
  const [autorizedUser, setAutorizedUser] = useState(false);
  const [isPostulant, setIsPostulant] = useState(false);
  const [isVerifier, setIsVerifier] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [totalArea, setTotalArea] = useState(0);
  const [latLngCentroid, setLatLngCentroid] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [status, setStatus] = useState("");
  const [formCompletion, setFormCompletion] = useState({
    cadastralRecords: false,
    actualUseAndPotential: false,
    useRestrictions: false,
    ecosystem: false,
    generalAspects: false,
    relations: false,
  });
  const [isProgressPanelCollapsed, setIsProgressPanelCollapsed] = useState(false);
  const isInitialRequirementsSync = useRef(true);
  const prevCompletedKeysRef = useRef(new Set());

  const verificationGate = useMemo(
    () => getPropertyVerificationGate(propertyData),
    [propertyData]
  );

  useEffect(() => {
    if (user && propertyData) {
      const postulant = propertyData?.projectPostulant?.id;
      const authorizedUsers = [...propertyData.projectVerifiers, postulant];

      console.log("propertyData", propertyData);
      console.log(
        "propertyData.projectVerifiers",
        propertyData.projectVerifiers
      );
      console.log("user.id", user.id);

      setAutorizedUser(
        (authorizedUsers.includes(user.id) &&
          (propertyData.propertyInfo.status === null ||
            propertyData.propertyInfo.status === "PENDING")) ||
          user.role === "admon" ||
          user.role === "analyst" ||
          propertyData.projectVerifiers.includes(user.id)
      );

      setIsPostulant(postulant === user.id);

      setIsVerifier(propertyData.projectVerifiers.includes(user.id));
    }
  }, [user, propertyData]);

  useEffect(() => {
    if (user && propertyData) {
      setStatus(propertyData?.propertyInfo?.status || "PENDING");
    }
  }, [user, propertyData, setHasUnsavedChanges]);

  const handleValidateProperty = async (status) => {
    if (!propertyData?.propertyInfo?.id) {
      console.error("❌ Error: El predio no tiene un ID válido.");
      toast.error("Error en la información del predio.");
      return;
    }

    setIsLoading(true);
    try {
      // 🔹 Actualizar estado del predio en la API
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: propertyData.propertyInfo.id,
            status,
          },
        })
      );

      // 🔹 Obtener el ID del dueño del predio
      const propertyOwnerID = propertyData.projectPostulant?.id || null;

      if (!propertyOwnerID) {
        console.warn("⚠️ No se encontró un dueño del predio en propertyData.");
      }

      // 🔹 Crear mensaje de notificación según estado
      const notificationMessage =
        status === "APPROVED"
          ? `✅ Tu predio '${propertyData.propertyInfo.name}' ha sido aprobado. 🎉`
          : `❌ Tu predio '${propertyData.propertyInfo.name}' ha sido rechazado.`;

      const notificationData = {
        userOriginID: user.id,
        userID: propertyOwnerID,
        message: notificationMessage,
        type: "PROPERTY",
        resourceID: propertyData.propertyInfo.id,
        isRead: false,
      };

      console.log("📩 Enviando notificación:", notificationData);

      // 🔹 Enviar la notificación si hay un propietario identificado
      if (propertyOwnerID) {
        await API.graphql(
          graphqlOperation(createNotification, { input: notificationData })
        );
      } else {
        console.warn(
          "⚠️ No se envió la notificación porque no hay dueño asignado al predio."
        );
      }

      toast.success(
        `Predio ${
          status === "APPROVED" ? "aprobado" : "rechazado"
        } exitosamente`
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(
        "❌ Error al actualizar el estado del predio o enviar la notificación:",
        error
      );
      toast.error("Error en la validación del predio.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormCompletion = (formName, isComplete) => {
    console.log(`📩 Recibido desde hijo: ${formName} →`, isComplete);

    setFormCompletion((prev) => {
      const newCompletion = { ...prev, [formName]: Boolean(isComplete) };
      const anyComplete = Object.values(newCompletion).some(
        (value) => value === true
      );
      setIsFormComplete(anyComplete);

      return newCompletion;
    });
  };

  // Función para mostrar el modal con las opciones de validación
  const handleVerifyClick = async () => {
    const gate = getPropertyVerificationGate(propertyData);

    if (!gate.isReady) {
      Swal.fire({
        icon: "warning",
        title: "Pasos pendientes",
        html: `
          <p class="mb-2">Completa estos requisitos antes de validar el predio:</p>
          <ul class="text-left text-sm" style="padding-left: 1.25rem;">
            ${gate.pending
              .map((item) => `<li>${item}</li>`)
              .join("")}
          </ul>
        `,
        confirmButtonColor: "#6e6c35",
      });
      return;
    }

    Swal.fire({
      title: "Verificación del predio",
      text: "Selecciona si deseas aprobar o rechazar el predio.",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "✅ Aprobar",
      denyButtonText: "❌ Rechazar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      confirmButtonColor: "#28a745",
      denyButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        handleValidateProperty("APPROVED");
      } else if (result.isDenied) {
        handleValidateProperty("REJECTED");
      }
    });
  };

  const requirements = useMemo(() => {
    const pfs = propertyData?.propertyFeatures || [];

    const featureCompleted = (ids) => {
      for (const pf of pfs) {
        if (ids.includes(pf?.featureID) && isNonEmptyValue(pf?.value)) {
          return true;
        }
      }
      return false;
    };

    return PREDIAL_SECTIONS.map((section, index) => ({
      ...section,
      step: index + 1,
      completed: featureCompleted(FEATURE_ID_MAP[section.key] || []),
    }));
  }, [propertyData]);

  const completedCount = requirements.filter((req) => req.completed).length;
  const progressPercent = Math.round(
    (completedCount / requirements.length) * 100
  );
  const pendingRequirements = requirements.filter((req) => !req.completed);
  const nextPendingRequirement = pendingRequirements[0] || null;

  const scrollToSection = (key) => {
    const section = requirements.find((req) => req.key === key);
    if (!section) return;

    const element = document.getElementById(section.sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGoToNextPending = () => {
    if (nextPendingRequirement) {
      scrollToSection(nextPendingRequirement.key);
    }
  };

  const getSectionWrapperClass = (completed, isNext) => {
    const base =
      "rounded-xl border shadow-terrasacha scroll-mt-32 transition-all duration-300";

    if (completed) {
      return `${base} border-terrasacha-secondary2/60 bg-terrasacha-secondary2/5`;
    }

    if (isNext) {
      return `${base} border-terrasacha-primary ring-2 ring-terrasacha-primary/25 bg-white`;
    }

    return `${base} border-terrasacha-light/20 bg-white`;
  };

  useEffect(() => {
    if (!propertyData) return;

    const currentCompleted = new Set(
      requirements.filter((req) => req.completed).map((req) => req.key)
    );

    if (isInitialRequirementsSync.current) {
      isInitialRequirementsSync.current = false;
      prevCompletedKeysRef.current = currentCompleted;
      return;
    }

    const newlyCompleted = requirements.find(
      (req) => req.completed && !prevCompletedKeysRef.current.has(req.key)
    );

    prevCompletedKeysRef.current = currentCompleted;

    if (!newlyCompleted) return;

    const nextPending = requirements.find((req) => !req.completed);
    if (nextPending) {
      toast.success(
        `${newlyCompleted.label} completado. Continúa con: ${nextPending.label}`
      );
      window.setTimeout(() => scrollToSection(nextPending.key), 700);
      return;
    }

    toast.success("Has completado toda la información predial.");
  }, [propertyData, requirements]);

  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {pendingRequirements.length > 0 ? (
        <aside
          className="sticky top-20 lg:top-24 z-30 bg-white border border-terrasacha-light/40 rounded-xl shadow-terrasacha-lg"
          aria-label="Progreso de información predial"
        >
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-terrasacha-secondary1 font-typographica mb-1">
                  Diligenciamiento guiado · Información Predial
                </p>
                <p className="text-xs text-terrasacha-secondary1 opacity-80 font-typographica mb-2">
                  {completedCount} de {requirements.length} secciones completadas.
                  {nextPendingRequirement
                    ? ` Siguiente: ${nextPendingRequirement.label}.`
                    : ""}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-terrasacha-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-terrasacha-primary font-typographica whitespace-nowrap">
                    {progressPercent}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProgressPanelCollapsed((prev) => !prev)}
                className="text-terrasacha-primary hover:bg-terrasacha-primary/10 p-2 rounded-lg transition-colors flex-shrink-0"
                aria-label={
                  isProgressPanelCollapsed
                    ? "Expandir resumen de pendientes"
                    : "Colapsar resumen de pendientes"
                }
                aria-expanded={!isProgressPanelCollapsed}
              >
                {isProgressPanelCollapsed ? (
                  <FaChevronDown className="w-4 h-4" />
                ) : (
                  <FaChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>

            {!isProgressPanelCollapsed && (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                  {requirements.map((req) => (
                    <li key={req.key}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(req.key)}
                        disabled={req.completed}
                        className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-typographica transition-colors ${
                          req.completed
                            ? "bg-terrasacha-secondary2/10 text-terrasacha-secondary1 cursor-default"
                            : req.key === nextPendingRequirement?.key
                            ? "bg-terrasacha-primary/10 text-terrasacha-secondary1 hover:bg-terrasacha-primary/15"
                            : "bg-terrasacha-earth/30 text-terrasacha-secondary1 hover:bg-terrasacha-earth/50"
                        }`}
                        aria-label={`Ir a ${req.label}`}
                      >
                        {req.completed ? (
                          <FaCheckCircle
                            className="text-terrasacha-secondary2 flex-shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaClock
                            className="text-yellow-600 flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate">
                          {req.step}. {req.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handleGoToNextPending}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white text-xs font-typographica font-semibold transition-colors"
                  aria-label="Ir al siguiente requisito pendiente"
                >
                  {completedCount === 0 ? "Completar ahora" : "Siguiente pendiente"}
                  <FaArrowRight size={10} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </aside>
      ) : (
        <div className="bg-terrasacha-secondary2/10 border border-terrasacha-secondary2/40 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-terrasacha-secondary2" aria-hidden="true" />
            <p className="text-sm font-semibold text-terrasacha-secondary1 font-typographica mb-0">
              Información predial completada. Todas las secciones están diligenciadas.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6" id="forms-start">
        {requirements.map((section) => {
          const FormComponent = section.Component;
          const isNext = section.key === nextPendingRequirement?.key;

          return (
            <div
              key={section.key}
              id={section.sectionId}
              className={`p-4 sm:p-6 ${getSectionWrapperClass(
                section.completed,
                isNext
              )}`}
            >
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-terrasacha-light/20">
                <p className="text-xs font-typographica text-terrasacha-secondary1 mb-0">
                  Sección {section.step} de {requirements.length}
                </p>
                {section.completed ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terrasacha-secondary2 text-white text-[10px] font-semibold font-typographica uppercase">
                    <FaCheckCircle size={10} aria-hidden="true" />
                    Completado
                  </span>
                ) : isNext ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-terrasacha-primary text-white text-[10px] font-semibold font-typographica uppercase">
                    Siguiente paso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-semibold font-typographica uppercase">
                    <FaClock size={10} aria-hidden="true" />
                    Pendiente
                  </span>
                )}
              </div>
              <FormComponent
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChangeWithRefresh}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion(section.formName, isComplete)
                }
              />
            </div>
          );
        })}

        {/* Sección de Validación */}
        <PropertyVerifyActionBar
          isVerifier={isVerifier}
          status={status}
          isLoading={isLoading}
          verificationGate={verificationGate}
          onVerify={handleVerifyClick}
        />
      </div>
    </div>
  );
}
