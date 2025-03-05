import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaFileUpload, FaTrash, FaEye, FaEdit } from "react-icons/fa";
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

export default function ValidationModal({ isOpen, onClose , onValidationComplete}) {
  const { s3Client, bucketName } = useS3Client();
  const { user } = useAuth();
  const { propertyData } = usePropertyData();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [s3Files, setS3Files] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // ✅ Verifica si el predio ya tiene archivos subidos o es nuevo
  const isNewProperty = !propertyData?.projectFiles || propertyData.projectFiles.length === 0;
  
  // ✅ Verifica si tiene una campaña asociada
  const hasCampaign = propertyData?.propertyCampaign?.id !== null;

  // ✅ Ruta base específica del predio
  const basePath = `projects/${propertyData.propertyInfo?.id}/other/`;

  useEffect(() => {
    if (isOpen) {
      listS3Files();
    }
  }, [isOpen, propertyData?.propertyInfo?.id]); // Se ejecuta cuando cambia el predio

  const listS3Files = async () => {
    setLoading(true);
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: basePath,
      });

      const response = await s3Client.send(command);
      const allFiles = response.Contents || [];

      const formattedFiles = allFiles.map((file) => ({
        key: file.Key,
        name: file.Key.split("/").pop(),
      }));

      setS3Files(formattedFiles);

      // 🔴 Asignar archivos ya subidos según el predio seleccionado
      const uploaded = {};
      formattedFiles.forEach((file) => {
        const fileType = file.name.split("_")[0];
        uploaded[fileType] = file.key;
      });
      setUploadedFiles(uploaded);
      checkIfAllFilesUploaded(uploaded);
    } catch (error) {
      console.error("Error al listar archivos en S3:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async () => {
    setLoading(true);
    try {
      await Promise.all(
        Object.entries(selectedFiles).map(async ([fileType, file]) => {
          const fileKey = `${basePath}${fileType}_${file.name}`;

          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: file,
            ContentType: file.type,
          });

          await s3Client.send(command);
        })
      );

      await listS3Files();
      setSelectedFiles({});

      toast.success("Los archivos fueron subidos con éxito", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error al subir archivos a S3:", error);
      toast.error("Error al subir los archivos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const deleteS3File = async (fileKey, fileType) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el archivo de S3.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
          });

          await s3Client.send(command);
          await listS3Files();

          setUploadedFiles((prev) => {
            const updated = { ...prev };
            delete updated[fileType];
            return updated;
          });
        } catch (error) {
          console.error("Error al eliminar archivo de S3:", error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const getSignedFileUrl = async (fileKey) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  };

  const handleFileSelection = (event, fileType) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setSelectedFiles((prev) => ({ ...prev, [fileType]: selectedFile }));
    }
  };

    // ✅ Verifica si ya están los tres archivos y notifica a `Timeline`
    const checkIfAllFilesUploaded = (files) => {
        if (["certificado", "escrituras", "planos"].every((fileType) => fileType in files)) {
          console.log("✅ Todos los archivos requeridos han sido subidos. Notificando a Timeline...");
          onValidationComplete(); // ✅ Notificar a Timeline que los archivos están completos
        }
      };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Requisitos para la Prefactibilidad</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <p className="text-gray-600 mb-4">
          Para completar este paso, debes subir los siguientes documentos:
        </p>

        {["certificado", "escrituras", "planos"].map((fileType) => (
          <div key={fileType} className="flex items-center justify-between border p-3 rounded-md shadow-sm mb-3">
            <span className="text-gray-700 text-sm capitalize">
              {fileType === "certificado"
                ? "Certificado de Libertad"
                : fileType === "escrituras"
                ? "Escrituras Públicas"
                : "Planos Catastrales"}
            </span>

            <div className="flex items-center gap-2">
              {uploadedFiles[fileType] ? (
                <>
                  {/* ✅ Botón Ver */}
                  <button
                    onClick={async () => window.open(await getSignedFileUrl(uploadedFiles[fileType]), "_blank")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center gap-2"
                  >
                    <FaEye size={14} />
                    Ver
                  </button>

                  {/* ✅ Botón Editar */}
                  <input
                    type="file"
                    className="hidden"
                    id={`file-upload-${fileType}`}
                    onChange={(e) => handleFileSelection(e, fileType)}
                  />
                  <label
                    htmlFor={`file-upload-${fileType}`}
                    className="cursor-pointer bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex items-center gap-2"
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
                    className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaFileUpload size={14} />
                    Subir
                  </label>
                </>
              )}
            </div>
          </div>
        ))}

        <Button variant="primary" className="mt-3" onClick={uploadFiles} disabled={loading || Object.keys(selectedFiles).length === 0}>
          {loading ? <Spinner size="sm" animation="border" /> : "Guardar Cambios"}
        </Button>

        {!hasCampaign && (
          <p className="text-red-500 text-sm mt-4 font-semibold">
            Cualquier solicitud en esta etapa debe realizarse a través de un PQRS, ya que aún no hay un consultor asignado.
          </p>
        )}
      </Modal.Body>
    </Modal>
  );
}
