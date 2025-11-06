import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { createNotification, updateProperty } from "graphql/mutations";
import { listPropertyFeatures } from "graphql/queries";
import Swal from "sweetalert2";

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

export default function PropertyDetails({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
  currentStep,
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

  useEffect(() => {
    console.log(
      "📌 Valor actual de currentStep en PropertyDetails:",
      currentStep
    );
  }, [currentStep]);

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

  const checkAllStepsCompleted = async () => {
    try {
      const response = await API.graphql(
        graphqlOperation(listPropertyFeatures, {
          filter: {
            propertyID: { eq: propertyData?.propertyInfo?.id },
            featureID: { eq: "GLOBAL_PROPERTY_STATUS" },
          },
        })
      );

      const items = response?.data?.listPropertyFeatures?.items || [];
      if (items.length === 0) return false;

      const value = JSON.parse(items[0].value);

      const booleanFieldsValid =
        value.analisis === true &&
        value.monitoreos === true &&
        value.revision_memorando === true &&
        value.validacion_inicial === true;

      const memorandoValid =
        value.memorando &&
        !!value.memorando.uploadDate &&
        !!value.memorando.url;

      return booleanFieldsValid && memorandoValid;
    } catch (error) {
      console.error("❌ Error verificando pasos del propertyFeature:", error);
      return false;
    }
  };

  // Función para mostrar el modal con las opciones de validación
  const handleVerifyClick = async () => {
    const allStepsReady = await checkAllStepsCompleted();

    if (!allStepsReady) {
      Swal.fire({
        icon: "warning",
        title: "Pasos pendientes",
        text: "Aún hay pasos del propietario sin completar. Por favor, completa todos antes de validar.",
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


  if (!visible || !propertyData) {
    return null;
  }

  // --- Requisitos prediales (alineados con PropertyGeneral.jsx 76-82) ---
  const featureIdMap = {
    usoActualPotencial: ['D_USO_ACTUAL_POTENCIAL', 'ACTUAL_USE_POTENTIAL', 'D_actual_use'],
    limitacionesUsoSuelo: ['D_LIMITACIONES_USO_SUELO', 'USE_RESTRICTIONS', 'E_restriccion_desc', 'E_resctriccion_other'],
    aspectosEcosistema: ['D_ASPECTOS_ECOSISTEMA', 'ECOSYSTEM', 'D_aspects_ecosystem', 'F_nacimiento_agua'],
    aspectosPredio: ['D_ASPECTOS_PREDIO', 'GENERAL_ASPECTS', 'D_aspects_property', 'G_habita_predio'],
    relacionesEntidades: ['D_RELACIONES_ENTIDADES', 'RELATIONS', 'D_relations_entities', 'H_aliados_estrategicos_desc', 'H_grupo_comunitario_desc', 'H_asistance_desc'],
  };

  const isNonEmptyValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') {
      const v = value.trim();
      if (v.length === 0) return false;
      try {
        const parsed = JSON.parse(v);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed)) return parsed.length > 0;
          return Object.keys(parsed).length > 0;
        }
      } catch (_) {
        // no JSON, string no vacía es válida
      }
      return true;
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) return value.length > 0;
      return Object.keys(value).length > 0;
    }
    return true;
  };

  const featureCompleted = (ids) => {
    const pfs = propertyData?.propertyFeatures || [];
    for (const pf of pfs) {
      if (ids.includes(pf?.featureID) && isNonEmptyValue(pf?.value)) {
        return true;
      }
    }
    return false;
  };

  const requirements = [
    { key: 'usoActualPotencial', label: 'Uso actual y potencial', completed: featureCompleted(featureIdMap.usoActualPotencial) },
    { key: 'limitacionesUsoSuelo', label: 'Limitaciones de uso de suelo', completed: featureCompleted(featureIdMap.limitacionesUsoSuelo) },
    { key: 'aspectosEcosistema', label: 'Aspectos generales del ecosistema', completed: featureCompleted(featureIdMap.aspectosEcosistema) },
    { key: 'aspectosPredio', label: 'Aspectos generales del predio', completed: featureCompleted(featureIdMap.aspectosPredio) },
    { key: 'relacionesEntidades', label: 'Relaciones con entidades y aliados estratégicos', completed: featureCompleted(featureIdMap.relacionesEntidades) },
  ];

  const missingList = requirements.filter(r => !r.completed).map(r => r.key);

  const getLabel = (key) => {
    switch (key) {
      case 'usoActualPotencial':
        return 'Uso actual y potencial';
      case 'limitacionesUsoSuelo':
        return 'Limitaciones de uso de suelo';
      case 'aspectosEcosistema':
        return 'Aspectos generales del ecosistema';
      case 'aspectosPredio':
        return 'Aspectos generales del predio';
      case 'relacionesEntidades':
        return 'Relaciones con entidades y aliados estratégicos';
      default:
        return key;
    }
  };

  const handleScrollToForms = () => {
    const el = document.getElementById("forms-start");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      {/* Persuasión: alerta de campos requeridos */}
      {missingList.length > 0 && (
        <div className="bg-terrasacha-light/10 border border-terrasacha-light/40 rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-terrasacha-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
            <div>
              <p className="text-sm text-terrasacha-secondary1 font-typographica">
                Para avanzar con tu proyecto, completa la siguiente información requerida. ¡Esto mejora la verificación y acelera la aprobación!
              </p>
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                {missingList.map((key) => (
                  <li key={key} className="text-xs font-typographica text-terrasacha-secondary1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {getLabel(key)} pendiente
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleScrollToForms}
                className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white text-xs font-typographica transition-colors"
              >
                Completar ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formularios de Información Detallada */}
      <div className="space-y-6" id="forms-start">

        {/* Uso Actual y Potencial */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <ActualUseAndPotential
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChangeWithRefresh}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("actualUseAndPotential", isComplete)
            }
          />
        </div>

        {/* Restricciones de Uso */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <UseRestrictions
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChangeWithRefresh}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("useRestrictions", isComplete)
            }
          />
        </div>

        {/* Ecosistema */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <Ecosystem
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChangeWithRefresh}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("ecosystem", isComplete)
            }
          />
        </div>

        {/* Aspectos Generales */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <GeneralAspects
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChangeWithRefresh}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("generalAspects", isComplete)
            }
          />
        </div>

        {/* Relaciones */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <Relations
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChangeWithRefresh}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("relations", isComplete)
            }
          />
        </div>

        


        {/* Sección de Validación */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <div className="text-center">
            {/* Mostrar estado del predio */}
            {status === "APPROVED" && (
              <div 
                className="px-4 py-2 text-white rounded-lg font-semibold font-typographica inline-block"
                style={{ backgroundColor: '#849b50' }} // Verde Pradera
              >
                ✅ Predio Aprobado
              </div>
            )}

            {status === "REJECTED" && (
              <div 
                className="px-4 py-2 text-white rounded-lg font-semibold font-typographica inline-block"
                style={{ backgroundColor: '#dc3545' }} // Rojo
              >
                ❌ Predio Rechazado
              </div>
            )}

            {status === "NOT_SELECTABLE" && (
              <div 
                className="px-4 py-2 text-white rounded-lg font-semibold font-typographica inline-block"
                style={{ backgroundColor: '#dc3545' }} // Rojo
              >
                ❌ Predio no elegible
              </div>
            )}

            {/* Mostrar el botón solo si el usuario es verificador y el estado es PENDING */}
            {isVerifier && (
              <>
                <button
                  className="btn w-full mt-4 px-6 py-3 font-typographica"
                  style={{
                    backgroundColor: '#6e6c35', // Verde Selva
                    borderColor: '#6e6c35',
                    color: 'white'
                  }}
                  onClick={handleVerifyClick}
                  disabled={isLoading || currentStep < 4}
                >
                  {isLoading ? "Procesando..." : "Verificar"}
                </button>

                {/* Mensaje de advertencia si el usuario intenta verificar antes del paso 4 */}
                {currentStep < 4 && (
                  <p className="text-terrasacha-danger text-sm mt-2 font-typographica">
                    ⚠ Debes completar los pasos anteriores antes llegar al paso 4.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
