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
  const { propertyData } = usePropertyData();
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

  return (
    <div className="space-y-6">
      {/* Información Predial */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <h2 className="text-lg sm:text-xl font-bold text-terrasacha-primary mb-4 font-typographica">
          Información Predial
        </h2>

        {/* Datos básicos del predio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Nombre
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyInfo?.name || "Sin nombre"}
              </p>
            </div>
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Departamento
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyInfo?.department || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Número Catastral
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyInfo?.cadastralNumber || "No disponible"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Fecha de Creación
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyInfo?.createdAt
                  ? new Date(propertyData.propertyInfo.createdAt).toLocaleDateString(
                      "es-ES"
                    )
                  : "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Última Actualización
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyInfo?.updatedAt
                  ? new Date(propertyData.propertyInfo.updatedAt).toLocaleDateString(
                      "es-ES"
                    )
                  : "No disponible"}
              </p>
            </div>
            <div>
              <p className="text-xs text-terrasacha-secondary1 font-typographica mb-1">
                Características
              </p>
              <p className="text-sm font-semibold text-terrasacha-primary font-typographica">
                {propertyData?.propertyFeatures?.length || 0}{" "}
                características registradas
              </p>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {propertyData?.propertyInfo?.description && (
          <div className="mb-4">
            <p className="text-xs text-terrasacha-secondary1 font-typographica mb-2">
              Descripción
            </p>
            <p className="text-sm text-terrasacha-secondary1 font-typographica bg-terrasacha-light/10 p-3 rounded-lg">
              {propertyData.propertyInfo.description}
            </p>
          </div>
        )}
      </div>

      {/* Formularios de Información Detallada */}
      <div className="space-y-6">

        {/* Uso Actual y Potencial */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <ActualUseAndPotential
            autorizedUser={autorizedUser}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChange}
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
            handleFieldChange={handleFieldChange}
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
            handleFieldChange={handleFieldChange}
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
            handleFieldChange={handleFieldChange}
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
            handleFieldChange={handleFieldChange}
            updateFormCompletion={(isComplete) =>
              updateFormCompletion("relations", isComplete)
            }
          />
        </div>

        {/* Archivos Adicionales */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
          <AdditionalFiles
            autorizedUser={autorizedUser}
            basePath={`projects/${propertyData.propertyInfo?.projectID}/other/`}
            setHasUnsavedChanges={setHasUnsavedChanges}
            handleFieldChange={handleFieldChange}
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
