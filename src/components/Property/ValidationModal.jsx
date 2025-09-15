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
    <Modal size="lg" show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-terrasacha-light">
        <Modal.Title className="font-typographica text-terrasacha-primary">Requisitos para la Prefactibilidad</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-terrasacha-secondary1 mb-4 font-typographica">
              Para completar este paso, debes subir los siguientes documentos:
            </p>

            {["certificado", "escrituras", "planos"].map((fileType) => (
              <div
                key={fileType}
                className="flex items-center justify-between border border-terrasacha-light p-3 rounded-lg shadow-terrasacha mb-3 bg-white"
              >
                <span className="text-terrasacha-secondary1 text-sm capitalize font-typographica">
                  {fileType === "certificado"
                    ? "Certificado de Libertad(vigencia 30 dias)"
                    : fileType === "escrituras"
                    ? "Escrituras Públicas"
                    : "Planos Catastrales"}
                </span>

                <div className="flex items-center gap-2">
                  {/* 🔹 Botón "Ver" solo si el archivo ya está en S3 */}
                  {uploadedFiles[fileType] &&
                    !uploadedFiles[fileType].startsWith("pending-") && (
                      <button
                        onClick={async () =>{
                          console.log('uploadedFiles[fileType]', uploadedFiles[fileType])
                          window.open(
                            await getSignedFileUrl(uploadedFiles[fileType]),
                            "_blank"
                          )}
                        }
                        className="btn-terrasacha-success px-3 py-1 flex items-center gap-2 font-typographica"
                      >
                        <FaEye size={14} />
                        Ver
                      </button>
                    )}

                  {!isUploadDisabled ? (
                    (uploadedFiles[fileType] || pendingFiles[fileType]) && (
                      <>
                        <input
                          type="file"
                          className="hidden"
                          id={`file-upload-${fileType}`}
                          onChange={(e) => handleFileSelection(e, fileType)}
                        />
                        <label
                          htmlFor={`file-upload-${fileType}`}
                          className="btn-terrasacha-warning cursor-pointer px-3 py-1 flex items-center gap-2 font-typographica"
                        >
                          <FaEdit size={14} />
                          Editar
                        </label>
                      </>
                    )
                  ) : (
                    <span className="text-terrasacha-secondary2 text-sm italic font-typographica">
                      No editable
                    </span>
                  )}

                  {/* 🔹 Botón "Subir" solo si no hay un archivo seleccionado todavía */}
                  {!isUploadDisabled &&
                    !uploadedFiles[fileType] &&
                    !pendingFiles[fileType] && (
                      <>
                        <input
                          type="file"
                          className="hidden"
                          id={`file-upload-${fileType}`}
                          onChange={(e) => handleFileSelection(e, fileType)}
                        />
                        <label
                          htmlFor={`file-upload-${fileType}`}
                          className="btn-terrasacha-primary cursor-pointer px-3 py-1 flex items-center gap-2 font-typographica"
                        >
                          <FaFileUpload size={14} />
                          Subir
                        </label>
                      </>
                    )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <PropertyChat
              propertyId={propertyData.propertyInfo?.id}
              featureChat={"GLOBAL_PROPERTY_FILES"}
            />
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="btn-terrasacha-primary px-4 py-2 font-typographica"
            onClick={() => uploadFiles()}
            disabled={loading || Object.keys(selectedFiles).length === 0}
          >
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>

        {!hasCampaign && (
          <p className="text-terrasacha-danger text-sm mt-4 font-semibold font-typographica">
            Cualquier solicitud en esta etapa debe realizarse a través de un
            PQRS, ya que aún no hay un consultor asignado.
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
}
