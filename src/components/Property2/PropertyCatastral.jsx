import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { createNotification, updateProperty } from "graphql/mutations";
import { listPropertyFeatures } from "graphql/queries";
import Swal from "sweetalert2";

// Componente de registros catastrales
import CadastralRecords from "components/Property/CadastralRecords";


// --- Mapeo de roles ---
const roleMapping = {
  constructor: "Constructor",
  legal: "Revisor Legal",
  validator: "Validador",
  admon: "Administrador",
  analyst: "Analista",
};

export default function PropertyCatastral({
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
  });

  useEffect(() => {
    console.log(
      "📌 Valor actual de currentStep en PropertyCatastral:",
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

      {/* Registros Catastrales */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <h3 className="text-lg font-bold mb-4 font-typographica text-terrasacha-primary">
          Registros Catastrales
        </h3>
        <CadastralRecords
          autorizedUser={autorizedUser}
          totalArea={totalArea}
          latLngCentroid={latLngCentroid}
          setTotalArea={setTotalArea}
          setHasUnsavedChanges={setHasUnsavedChanges}
          handleFieldChange={handleFieldChange}
          updateFormCompletion={(isComplete) =>
            updateFormCompletion("cadastralRecords", isComplete)
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
  );
}
