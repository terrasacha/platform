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

            {/* Property Documents */}
            <div>
              <div className="bg-white/95 backdrop-blur-sm shadow-terrasacha-xl rounded-3xl p-4 sm:p-6 border border-terrasacha-light/30 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-terrasacha-light/5 to-transparent opacity-50"></div>
                
                <h3 className="text-xl font-typographica font-bold text-transparent bg-clip-text bg-gradient-to-r from-terrasacha-secondary1 to-terrasacha-primary mb-6 relative z-10">
                  Documentos del predio
                </h3>
                {propertyFiles.length === 0 ? (
                  <p className="text-terrasacha-light italic font-typographica relative z-10">
                    No hay documentos asociados.
                  </p>
                ) : (
                  <div className="space-y-3 relative z-10">
                    {propertyFiles.map((doc, idx) => (
                      <div
                        key={doc.url + idx}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-terrasacha-light/20 to-transparent rounded-xl border border-terrasacha-light/40 hover:border-terrasacha-light/60 transition-all duration-300 hover:shadow-terrasacha-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-terrasacha-secondary1 font-typographica font-medium truncate">
                            {doc.name}
                          </p>
                          <p className="text-terrasacha-light text-sm font-typographica">
                            {doc.type}
                          </p>
                        </div>
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
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 hover:from-terrasacha-secondary1 hover:to-terrasacha-primary text-white font-typographica font-semibold rounded-xl transition-all duration-300 shadow-terrasacha-lg hover:shadow-terrasacha-xl transform hover:scale-105 border border-white/20"
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

          {/* Status and Verification Section */}
          <div className="w-full mt-8 sm:mt-12 mb-12 sm:mb-16">
            <div className="bg-white/95 backdrop-blur-sm shadow-terrasacha-2xl rounded-3xl p-6 sm:p-8 w-full text-center border border-terrasacha-light/30 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-terrasacha-light/5 to-transparent opacity-50"></div>
              {/* Property Status */}
              {status === "APPROVED" && (
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-terrasacha-success to-green-600 text-white rounded-xl font-typographica font-bold shadow-terrasacha-lg border border-white/20 relative z-10">
                  <FaCheck className="text-lg" />
                  ✅ Predio Aprobado
                </div>
              )}

              {status === "REJECTED" && (
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-terrasacha-danger to-red-600 text-white rounded-xl font-typographica font-bold shadow-terrasacha-lg border border-white/20 relative z-10">
                  <FaTimes className="text-lg" />
                  ❌ Predio Rechazado
                </div>
              )}

              {status === "NOT_SELECTABLE" && (
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-terrasacha-danger to-red-600 text-white rounded-xl font-typographica font-bold shadow-terrasacha-lg border border-white/20 relative z-10">
                  <FaTimes className="text-lg" />
                  ❌ Predio no elegible
                </div>
              )}

              {/* Verification Button */}
              {isVerifier && (
                <div className="mt-6 relative z-10">
                  <button
                    className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 hover:from-terrasacha-secondary1 hover:to-terrasacha-primary text-white font-typographica font-bold rounded-2xl transition-all duration-300 shadow-terrasacha-xl hover:shadow-terrasacha-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
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
                    <div className="mt-4 p-4 bg-gradient-to-r from-terrasacha-earth/20 to-terrasacha-light/20 rounded-xl border border-terrasacha-earth/40 relative z-10">
                      <div className="flex items-center gap-3 text-terrasacha-secondary1 font-typographica">
                        <FaExclamationTriangle className="text-terrasacha-primary" />
                        <p className="text-sm">
                          ⚠ Debes completar los pasos anteriores antes llegar al paso 4.
                        </p>
                      </div>
                    </div>
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
