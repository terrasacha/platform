import React, { useEffect, useState } from "react";
import {
  FaFileUpload,
  FaTrash,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { useS3Client } from "context/s3ClientContext";
import { useAuth } from "context/AuthContext";
import { usePropertyData } from "context/PropertyDataContext";
import {
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API, graphqlOperation } from "aws-amplify";
import {
  createDocument,
  createPropertyFeature,
  createVerification,
  updateProperty,
  updatePropertyFeature,
} from "graphql/mutations";
import PropertyChat from "components/Legal/PropertyChat";
import { getProperty } from "utilities/customQueries";

export default function ValidationModal({
  isOpen,
  onClose,
  onValidationComplete,
}) {
  const { s3Client, bucketName } = useS3Client();
  const { user } = useAuth();
  const { propertyData } = usePropertyData();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [s3Files, setS3Files] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [propertyFeatureID, setPropertyFeatureID] = useState(null);
  const [verificationCreated, setVerificationCreated] = useState(false);
  const [pendingFiles, setPendingFiles] = useState({});
  const [property, setPropertyData] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [chatReady, setChatReady] = useState(false); // 🔧 Nuevo estado para controlar el chat
  const propertyID = propertyData.propertyInfo?.id;

  // ✅ Verifica si el predio ya tiene archivos subidos o es nuevo
  const isNewProperty =
    !propertyData?.projectFiles || propertyData.projectFiles.length === 0;

  // ✅ Verifica si tiene una campaña asociada
  const hasCampaign = propertyData?.propertyCampaign?.id !== null;

  // ✅ Ruta base específica del predio
  const basePath = `public/property/${propertyData.propertyInfo?.id}/other/`;

  useEffect(() => {
    if (isOpen) {
      listS3Files();
      // 🔴 Crear verificación para el chat si no existe
      createVerificationForChat();
      // 🔴 Inicializar propertyFeatureID si ya existe
      initializePropertyFeatureID();
    }
  }, [isOpen, propertyData?.propertyInfo?.id]);

  // 🔍 Debug: Verificar cambios en chatReady
  useEffect(() => {
    console.log("🔍 ValidationModal - chatReady cambió:", chatReady);
  }, [chatReady]);

  useEffect(() => {
    if (isOpen && propertyID) {
      fetchPropertyData(propertyID);
    }
  }, [isOpen, propertyID]);

  // 🔴 Nueva función para crear verificación para el chat
  const createVerificationForChat = async () => {
    try {
      if (!propertyData?.propertyInfo?.id) return;

      // Verificar si ya existe una verificación para GLOBAL_PROPERTY_FILES
      const existingFeature = propertyData.propertyFeatures?.items?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
      );

      if (existingFeature?.verifications?.items?.length > 0) {
        console.log("✅ Ya existe verificación para el chat");
        setChatReady(true); // 🔧 Marcar chat como listo
        return;
      }

      // Crear PropertyFeature si no existe
      let propertyFeatureID = existingFeature?.id;
      if (!propertyFeatureID) {
        const input = {
          propertyID: propertyData.propertyInfo.id,
          featureID: "GLOBAL_PROPERTY_FILES",
          value: JSON.stringify([]),
          isToBlockChain: false,
          isOnMainCard: false,
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, { input })
        );
        propertyFeatureID = response.data.createPropertyFeature.id;
        console.log("✅ PropertyFeature creado para el chat:", propertyFeatureID);
      }

      // Crear Verification para el chat
      const verificationInput = {
        propertyFeatureID: propertyFeatureID,
        userVerifiedID: propertyData.projectPostulant.id,
      };

      await API.graphql(
        graphqlOperation(createVerification, { input: verificationInput })
      );

      console.log("✅ Verification creada para el chat");
      setChatReady(true); // 🔧 Marcar chat como listo después de crear la verificación
    } catch (error) {
      console.error("❌ Error creando verificación para el chat:", error);
      setChatReady(false); // 🔧 Marcar chat como no listo en caso de error
    }
  };

  // Función para obtener los datos de la propiedad desde la API
  const fetchPropertyData = async (propertyID) => {
    try {
      const response = await API.graphql(
        graphqlOperation(getProperty, { id: propertyID })
      );
      setPropertyDetails(response.data.getProperty);
    } catch (error) {
      console.error("❌ Error al obtener los datos de la propiedad:", error);
    }
  };

  // 📌 Verifica si la carga debe estar deshabilitada
  const isUploadDisabled = propertyDetails
    ? (propertyDetails.status === "DOC_UPLOADED" &&
        propertyDetails.userLegalID) ||
      ["SELECTABLE", "REJECTED"].includes(propertyDetails.status)
    : true; // Si no hay datos, deshabilitamos por defecto

  const listS3Files = async () => {
    setLoading(true);
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: basePath,
      });

      const response = await s3Client.send(command);
      const files = response.Contents || [];

      const fileMap = {};
      files.forEach((file) => {
        const fileName = file.Key.split("/").pop();
        if (fileName.includes("certificado")) {
          fileMap.certificado = file.Key;
        } else if (fileName.includes("escrituras")) {
          fileMap.escrituras = file.Key;
        } else if (fileName.includes("planos")) {
          fileMap.planos = file.Key;
        }
      });

      setUploadedFiles(fileMap);
    } catch (error) {
      console.error("Error listing S3 files:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async () => {
    if (Object.keys(selectedFiles).length === 0) {
      toast.error("No hay archivos seleccionados para subir");
      return;
    }

    setLoading(true);
    try {
      const documents = [];
      const newUploadedFiles = { ...uploadedFiles };

      for (const [fileType, file] of Object.entries(selectedFiles)) {
        const fileKey = `${basePath}${fileType}_${Date.now()}_${file.name}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: file,
          ContentType: file.type,
        });

        await s3Client.send(command);
        documents.push({
          type: fileType.toUpperCase(),
          name: file.name,
          url: `https://${bucketName}.s3.amazonaws.com/${fileKey}`,
          key: fileKey,
        });

        // 🔴 Actualizar el estado uploadedFiles inmediatamente
        newUploadedFiles[fileType] = fileKey;

        setUploadProgress((prev) => ({
          ...prev,
          [fileType]: 100,
        }));
      }

      // 🔴 Actualizar el estado uploadedFiles con los nuevos archivos
      setUploadedFiles(newUploadedFiles);

      // 🔴 Obtener el PropertyFeatureID existente si no lo tenemos
      let currentPropertyFeatureID = propertyFeatureID;
      if (!currentPropertyFeatureID) {
        const existingFeature = propertyData.propertyFeatures?.items?.find(
          (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
        );
        if (existingFeature) {
          currentPropertyFeatureID = existingFeature.id;
          setPropertyFeatureID(existingFeature.id);
        }
      }

      // Crear PropertyFeature si no existe
      if (!currentPropertyFeatureID) {
        const newPropertyFeatureID = await createPropertyFeatureEntry(documents);
        setPropertyFeatureID(newPropertyFeatureID);
        currentPropertyFeatureID = newPropertyFeatureID;
      } else {
        // Actualizar PropertyFeature existente
        await updatePropertyFeatureEntry(documents);
      }

      // Crear Verification si no existe
      if (!verificationCreated) {
        await createVerificationEntry(currentPropertyFeatureID);
        setVerificationCreated(true);
      }

      // Actualizar estado del predio
      await updatePropertyStatus();

      toast.success("Archivos subidos exitosamente");
      setSelectedFiles({});
      setPendingFiles({});
      onValidationComplete();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error al subir los archivos");
    } finally {
      setLoading(false);
    }
  };

  const createPropertyFeatureEntry = async (documents) => {
    try {
      const input = {
        propertyID: propertyData.propertyInfo.id,
        featureID: "GLOBAL_PROPERTY_FILES",
        value: JSON.stringify(documents),
        isToBlockChain: false,
        isOnMainCard: false,
      };

      const response = await API.graphql(
        graphqlOperation(createPropertyFeature, { input })
      );

      return response.data.createPropertyFeature.id;
    } catch (error) {
      console.error("Error creating property feature:", error);
      throw error;
    }
  };

  const updatePropertyFeatureEntry = async (documents) => {
    try {
      // 🔴 Obtener el PropertyFeature existente
      const existingFeature = propertyData.propertyFeatures?.items?.find(
        (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
      );

      if (!existingFeature) {
        console.error("❌ No se encontró PropertyFeature para GLOBAL_PROPERTY_FILES");
        return;
      }

      const existingDocuments = existingFeature.value;
      let allDocuments = [];
      
      if (existingDocuments) {
        try {
          allDocuments = JSON.parse(existingDocuments);
        } catch (error) {
          console.error("Error parsing existing documents:", error);
        }
      }

      allDocuments = [...allDocuments, ...documents];

      const input = {
        id: existingFeature.id, // ✅ Usar el ID del feature existente
        value: JSON.stringify(allDocuments),
      };

      // ✅ CORREGIDO: Usar updatePropertyFeature
      await API.graphql(
        graphqlOperation(updatePropertyFeature, { input })
      );

      console.log("✅ PropertyFeature actualizado con documentos:", allDocuments);
    } catch (error) {
      console.error("Error updating property feature:", error);
      throw error;
    }
  };

  const createDocumentEntry = async (propertyFeatureID, document) => {
    try {
      const input = {
        propertyFeatureID: propertyFeatureID,
        name: document.name,
        type: document.type,
        url: document.url,
        data: JSON.stringify(document),
      };

      await API.graphql(graphqlOperation(createDocument, { input }));
    } catch (error) {
      console.error("Error creating document entry:", error);
      throw error;
    }
  };

  const createVerificationEntry = async (propertyFeatureID) => {
    try {
      const input = {
        propertyFeatureID: propertyFeatureID,
        userVerifiedID: propertyData.projectPostulant.id,
        // ❌ Removido el campo status que no existe en el schema
      };

      await API.graphql(graphqlOperation(createVerification, { input }));
    } catch (error) {
      console.error("Error creating verification entry:", error);
      throw error;
    }
  };

  const deleteS3File = async (fileKey, fileType) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      await s3Client.send(command);
      setUploadedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[fileType];
        return newFiles;
      });

      toast.success("Archivo eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error al eliminar el archivo");
    }
  };

  const getSignedFileUrl = async (fileKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
  };

  const getS3FileUrl = async (fileKey) => {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error("Error generating S3 URL:", error);
      return null;
    }
  };

  const handleFileSelection = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
      setPendingFiles((prev) => ({
        ...prev,
        [fileType]: file.name,
      }));
    }
  };

  const updatePropertyStatus = async () => {
    try {
      const input = {
        id: propertyData.propertyInfo.id,
        status: "DOC_UPLOADED",
      };

      await API.graphql(graphqlOperation(updateProperty, { input }));
    } catch (error) {
      console.error("Error updating property status:", error);
    }
  };

  const checkIfAllFilesUploaded = (files) => {
    const requiredTypes = ["certificado", "escrituras", "planos"];
    return requiredTypes.every((type) => files[type]);
  };

  // 🔴 Nueva función para inicializar propertyFeatureID
  const initializePropertyFeatureID = () => {
    const existingFeature = propertyData.propertyFeatures?.items?.find(
      (feature) => feature.featureID === "GLOBAL_PROPERTY_FILES"
    );
    if (existingFeature) {
      setPropertyFeatureID(existingFeature.id);
      console.log("✅ PropertyFeatureID inicializado:", existingFeature.id);
    }
  };

  return (
    <>
      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={onClose}
            ></div>

            {/* Modal content */}
            <div className="relative z-[10000] inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-terrasacha-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-terrasacha-primary to-terrasacha-secondary1 border-0 rounded-t-2xl p-6 flex items-center justify-between">
                <h3 className="text-xl font-typographica font-bold text-white">
                  Requisitos para la Prefactibilidad
                </h3>
                <button
                  onClick={onClose}
                  className="text-white hover:text-terrasacha-light transition-colors"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-gradient-to-br from-terrasacha-light/10 via-white to-terrasacha-earth/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-terrasacha-secondary1 mb-6 font-typographica">
                      Para completar este paso, debes subir los siguientes documentos:
                    </p>

                    {["certificado", "escrituras", "planos"].map((fileType) => (
                      <div
                        key={fileType}
                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-terrasacha-light shadow-terrasacha mb-4"
                      >
                        <span className="text-terrasacha-secondary1 text-sm font-typographica capitalize">
                          {fileType === "certificado"
                            ? "Certificado de Libertad (vigencia 30 días)"
                            : fileType === "escrituras"
                            ? "Escrituras Públicas"
                            : "Planos Catastrales"}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Botón "Ver" solo si el archivo ya está en S3 */}
                          {uploadedFiles[fileType] && (
                            <button
                              onClick={async () => {
                                console.log('uploadedFiles[fileType]', uploadedFiles[fileType]);
                                const url = await getSignedFileUrl(uploadedFiles[fileType]);
                                if (url) {
                                  window.open(url, "_blank");
                                }
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-terrasacha-success hover:bg-terrasacha-secondary2 text-white font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                            >
                              <FaEye size={14} />
                              Ver
                            </button>
                          )}

                          {!isUploadDisabled ? (
                            (uploadedFiles[fileType] || pendingFiles[fileType]) ? (
                              <>
                                <input
                                  type="file"
                                  className="hidden"
                                  id={`file-upload-${fileType}`}
                                  onChange={(e) => handleFileSelection(e, fileType)}
                                />
                                <label
                                  htmlFor={`file-upload-${fileType}`}
                                  className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-terrasacha-earth hover:bg-terrasacha-light text-terrasacha-secondary1 font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                                >
                                  <FaEdit size={14} />
                                  Editar
                                </label>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  className="hidden"
                                  id={`file-upload-${fileType}`}
                                  onChange={(e) => handleFileSelection(e, fileType)}
                                />
                                <label
                                  htmlFor={`file-upload-${fileType}`}
                                  className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-typographica font-semibold rounded-lg transition-all duration-300 shadow-terrasacha transform hover:scale-105"
                                >
                                  <FaFileUpload size={14} />
                                  Subir
                                </label>
                              </>
                            )
                          ) : (
                            <span className="text-terrasacha-light text-sm italic font-typographica">
                              No editable
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {chatReady ? (
                      <PropertyChat
                        propertyId={propertyData.propertyInfo?.id}
                        featureChat={"GLOBAL_PROPERTY_FILES"}
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-white to-terrasacha-light/20 p-6 border border-terrasacha-light/30 rounded-2xl shadow-terrasacha-lg h-96 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-typographica font-bold text-terrasacha-secondary1">
                            Mensajería del Predio
                          </h2>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-terrasacha-light/20 to-terrasacha-earth/20 rounded-full flex items-center justify-center animate-spin">
                              <svg className="w-8 h-8 text-terrasacha-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <p className="text-terrasacha-secondary1 font-typographica">Preparando chat...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    className="flex items-center gap-3 px-6 py-3 bg-terrasacha-primary hover:bg-terrasacha-secondary1 text-white font-typographica font-bold rounded-xl transition-all duration-300 shadow-terrasacha-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={() => uploadFiles()}
                    disabled={loading || Object.keys(selectedFiles).length === 0}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <FaSave className="text-lg" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>

                {!hasCampaign && (
                  <div className="mt-6 p-4 bg-terrasacha-earth bg-opacity-30 rounded-xl border border-terrasacha-earth">
                    <div className="flex items-center gap-3 text-terrasacha-secondary1 font-typographica">
                      <FaExclamationTriangle className="text-terrasacha-primary" />
                      <p className="text-sm font-semibold">
                        Cualquier solicitud en esta etapa debe realizarse a través de un
                        PQRS, ya que aún no hay un consultor asignado.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
