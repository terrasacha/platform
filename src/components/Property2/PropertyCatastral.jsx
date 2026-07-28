import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { createNotification, updateProperty } from "graphql/mutations";
import Swal from "sweetalert2";
import { FaInfoCircle } from "react-icons/fa";
import { getPropertyVerificationGate } from "utilities/getPropertyVerificationGate";
import PropertyVerifyActionBar from "./PropertyVerifyActionBar";

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


  if (!visible || !propertyData) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Registros Catastrales */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-terrasacha-light/20 shadow-terrasacha">
        <h3 className="text-lg font-bold mb-2 font-typographica text-terrasacha-primary">
          Registros Catastrales
        </h3>
        <div className="mb-4 p-4 bg-terrasacha-light/10 border border-terrasacha-light/40 rounded-lg">
          <div className="flex items-start gap-3">
            <FaInfoCircle
              className="text-terrasacha-primary mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-typographica text-terrasacha-secondary1 mb-1">
                <span className="font-bold text-terrasacha-primary">Requerido:</span>{" "}
                Debes registrar al menos un identificador catastral para continuar
                con la validación del predio.
              </p>
              <p className="text-xs font-typographica text-terrasacha-secondary1 opacity-80 mb-0">
                Ingresa el número de ficha catastral para consultar automáticamente
                el nombre del predio y el área asociada.
              </p>
            </div>
          </div>
        </div>
        <CadastralRecords
          autorizedUser={autorizedUser}
          totalArea={totalArea}
          latLngCentroid={latLngCentroid}
          setTotalArea={setTotalArea}
          setHasUnsavedChanges={setHasUnsavedChanges}
          handleFieldChange={handleFieldChange}
          tooltip="Cada registro catastral vincula el predio con datos oficiales de área y nomenclatura. Puedes agregar más de uno si el predio tiene varias fichas."
          updateFormCompletion={(isComplete) =>
            updateFormCompletion("cadastralRecords", isComplete)
          }
        />
      </div>


      {/* Sección de Validación */}
      <PropertyVerifyActionBar
        isVerifier={isVerifier}
        status={status}
        isLoading={isLoading}
        verificationGate={verificationGate}
        onVerify={handleVerifyClick}
      />
    </div>
  );
}
