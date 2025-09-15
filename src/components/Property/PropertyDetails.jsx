import React, { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import { getProjectProgress } from "services/getProjectProgress";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { HourGlassIcon } from "components/common/icons/HourGlassIcon";
import { usePropertyData } from "context/PropertyDataContext";
import Swal from "sweetalert2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FaEye, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";

import ActualUseAndPotential from "components/Constructor/Property/ActualUseAndPotential";
import UseRestrictions from "./UseRestrictions";
import Ecosystem from "./Ecosystem";
import GeneralAspects from "./GeneralAspects";
import Relations from "./Relations";
import CadastralRecords from "./CadastralRecords";
import AdditionalFiles from "./AdditionalFiles";
import { API, graphqlOperation } from "aws-amplify";
import { toast } from "react-toastify";
import { createNotification, updateProperty } from "graphql/mutations";
import { listPropertyFeatures } from "graphql/queries";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { useS3Client } from "context/s3ClientContext";

// --- Mapeo de tipos de documento ---
const documentTypeMapper = {
  CERTIFICADO_TRADICION: "Certificado de Tradición",
  ESCRITURA_PUBLICA: "Escritura Pública",
  PLANO_CATASTRAL: "Plano Catastral",
};

export default function PropertyDetails({
  visible,
  setHasUnsavedChanges,
  handleFieldChange,
  setIsFormComplete,
  currentStep,
}) {
  const { s3Client, bucketName } = useS3Client();
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
  const [propertyFiles, setPropertyFiles] = useState([]);

  useEffect(() => {
    console.log(
      "📌 Valor actual de currentStep en PropertyDetails:",
      currentStep
    );
  }, [currentStep]); // ✅ Se ejecuta cuando cambia currentStep

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
      setStatus(propertyData?.propertyInfo?.status || "PENDING"); // Inicializar estado
    }
  }, [user, propertyData, setHasUnsavedChanges]);

  const handleValidateProperty = async (status) => {
    if (!propertyData?.propertyInfo?.id) {
      toast.error("No se pudo obtener el ID del predio");
      return;
    }

    try {
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: {
            id: propertyData.propertyInfo.id,
            status: status,
          },
        })
      );

      const notificationData = {
        userOriginID: user.id,
        userID: propertyData.projectPostulant.id,
        message: `Tu predio '${propertyData.propertyInfo.name}' ha sido ${status === "APPROVED" ? "aprobado" : "rechazado"}.`,
        type: "PROPERTY",
        resourceID: propertyData.propertyInfo.id,
        isRead: false,
      };

      await API.graphql(
        graphqlOperation(createNotification, { input: notificationData })
      );

      toast.success(
        `Predio ${status === "APPROVED" ? "aprobado" : "rechazado"} exitosamente`
      );

      // Actualizar el estado local
      setStatus(status);
    } catch (error) {
      console.error("Error al actualizar el estado del predio:", error);
      toast.error("Error al actualizar el estado del predio");
    }
  };

  const updateFormCompletion = (formName, isComplete) => {
    setFormCompletion((prev) => ({
      ...prev,
      [formName]: isComplete,
    }));
    
    // 🔴 AVANCE INMEDIATO: Si cualquier formulario está completo, avanzar al paso 2
    if (isComplete) {
      console.log(`✅ Formulario ${formName} completado. Avanzando al paso 2...`);
      setIsFormComplete(true);
    }
  };

  // 🔴 ELIMINAMOS estas funciones que ya no necesitamos:
  // - checkAllStepsCompleted
  // - useEffect que llama a checkAllStepsCompleted

  const handleVerifyClick = async () => {
    if (currentStep < 4) {
      toast.error("Debes completar los pasos anteriores antes de verificar");
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas aprobar este predio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#849b50", // terrasacha-secondary2
      cancelButtonColor: "#dc3545",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await handleValidateProperty("APPROVED");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updatePropertyFiles = () => {
    if (!propertyData?.propertyInfo?.id) return;

    const files = propertyData.propertyFeatures?.items
      ?.filter((feature) => feature.featureID === "GLOBAL_PROPERTY_FILES")
      ?.map((feature) => {
        try {
          const filesData = JSON.parse(feature.value || "[]");
          return filesData.map((file) => ({
            ...file,
            type: documentTypeMapper[file.type] || file.type,
          }));
        } catch (error) {
          console.error("Error parsing files data:", error);
          return [];
        }
      })
      ?.flat() || [];

    setPropertyFiles(files);
  };

  useEffect(() => {
    updatePropertyFiles();
  }, [propertyData]);

  const getSignedFileUrl = async (fileKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hora
      });

      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
  };

  return (
    <>
      {visible && propertyData && (
        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Cadastral Records - Full Width */}
            <div className="xl:col-span-2">
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

            {/* Actual Use and Potential */}
            <div className="xl:col-span-2">
              <ActualUseAndPotential
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion("actualUseAndPotential", isComplete)
                }
              />
            </div>

            {/* Use Restrictions */}
            <div className="xl:col-span-2">
              <UseRestrictions
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion("useRestrictions", isComplete)
                }
              />
            </div>

            {/* Ecosystem */}
            <div className="xl:col-span-2">
              <Ecosystem
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion("ecosystem", isComplete)
                }
              />
            </div>

            {/* General Aspects */}
            <div>
              <GeneralAspects
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion("generalAspects", isComplete)
                }
              />
            </div>

            {/* Relations */}
            <div>
              <Relations
                autorizedUser={autorizedUser}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
                updateFormCompletion={(isComplete) =>
                  updateFormCompletion("relations", isComplete)
                }
              />
            </div>

            {/* Additional Files */}
            <div>
              <AdditionalFiles
                autorizedUser={autorizedUser}
                basePath={`projects/${propertyData.propertyInfo?.projectID}/other/`}
                setHasUnsavedChanges={setHasUnsavedChanges}
                handleFieldChange={handleFieldChange}
              />
            </div>

            {/* Sección de documentos del predio */}
            <div className="col">
              <div className="bg-white shadow-terrasacha rounded-lg p-6 border border-terrasacha-light">
                <h3 className="text-lg font-bold mb-4 font-typographica text-terrasacha-primary">Documentos del predio</h3>
                {propertyFiles.length === 0 ? (
                  <p className="text-terrasacha-secondary2 italic font-typographica">No hay documentos asociados.</p>
                ) : (
                  <div className="space-y-3 relative z-10">
                    {propertyFiles.map((doc, idx) => (
                      <div
                        key={doc.url + idx}
                        className="flex items-center justify-between border-b border-terrasacha-light py-2"
                      >
                        <span className="truncate max-w-xs font-typographica text-terrasacha-secondary1">
                          {doc.name}{" "}
                          <span className="text-terrasacha-secondary2 text-xs">({doc.type})</span>
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!doc.key) {
                              toast.error("No se pudo obtener la clave del archivo en S3");
                              return;
                            }
                            const signedUrl = await getSignedFileUrl(doc.key);
                            if (signedUrl) {
                              window.open(signedUrl, "_blank");
                            } else {
                              toast.error("No se pudo generar la URL firmada");
                            }
                          }}
                          className="btn px-3 py-1 font-typographica"
                          style={{
                            backgroundColor: '#6e6c35', // Verde Selva
                            borderColor: '#6e6c35',
                            color: 'white'
                          }}
                          aria-label={`Ver documento ${doc.name}`}
                        >
                          <FaEye className="text-sm" />
                          Ver
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mt-12 mb-16">
            <div className="bg-white shadow-terrasacha-xl rounded-lg p-6 w-full text-center border border-terrasacha-light">
              {/* Mostrar estado del predio */}
              {status === "APPROVED" && (
                <div 
                  className="px-4 py-2 text-white rounded-lg font-semibold font-typographica"
                  style={{ backgroundColor: '#849b50' }} // Verde Pradera
                >
                  ✅ Predio Aprobado
                </div>
              )}

              {status === "REJECTED" && (
                <div 
                  className="px-4 py-2 text-white rounded-lg font-semibold font-typographica"
                  style={{ backgroundColor: '#dc3545' }} // Rojo
                >
                  ❌ Predio Rechazado
                </div>
              )}

              {status === "NOT_SELECTABLE" && (
                <div 
                  className="px-4 py-2 text-white rounded-lg font-semibold font-typographica"
                  style={{ backgroundColor: '#dc3545' }} // Rojo
                >
                  ❌ Predio no elegible
                </div>
              )}

              {/* Verification Button */}
              {isVerifier && (
                <div className="mt-6 relative z-10">
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
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Procesando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <FaCheck className="text-lg" />
                        Verificar
                      </div>
                    )}
                  </button>

                  {/* Warning Message */}
                  {currentStep < 4 && (
                    <p className="text-terrasacha-danger text-sm mt-2 font-typographica">
                      ⚠ Debes completar los pasos anteriores antes llegar al
                      paso 4.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
