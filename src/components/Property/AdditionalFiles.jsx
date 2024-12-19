import Card from "components/common/Card";
import { usePropertyData } from "context/PropertyDataContext";
import React, { useEffect, useState } from "react";
import {
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { useS3Client } from "context/s3ClientContext";

export default function AdditionalFiles(props) {
  const { basePath, className } = props;
  const { propertyData } = usePropertyData();
  const { s3Client, bucketName } = useS3Client();

  const [files, setFiles] = useState([]); // Archivos locales seleccionados
  const [s3Files, setS3Files] = useState([]); // Archivos listados de S3
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listS3Files();
  }, [basePath, s3Client]);

  const listS3Files = async () => {
    setLoading(true);
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: basePath,
      });
      const response = await s3Client.send(command);
      const allFiles = response.Contents || [];

      const filteredFiles = allFiles.filter((file) => {
        const relativePath = file.Key.replace(basePath, "");
        return relativePath && !relativePath.includes("/");
      });

      setS3Files(filteredFiles);
    } catch (error) {
      console.error("Error al listar archivos en S3:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async () => {
    setLoading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: `${basePath}${file.name}`,
          Body: file,
        });
        await s3Client.send(command);
      });
      await Promise.all(uploadPromises);
      setFiles([]); // Limpiar archivos locales después de subir
      await listS3Files(); // Actualizar lista de archivos en S3
    } catch (error) {
      console.error("Error al subir archivos a S3:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteS3File = async (fileName) => {
    setLoading(true);
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName,
      });
      await s3Client.send(command);
      await listS3Files(); // Actualizar lista de archivos en S3
    } catch (error) {
      console.error("Error al eliminar archivo de S3:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    event.target.value = ""; // Solución: Reinicia el input después de seleccionar archivos
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Card className={className}>
      <Card.Header title="Subir documentación adicional" sep={true} />
      <Card.Body>
        <div className="max-w-xl mx-auto bg-white">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-gray-700 text-lg font-medium mb-2">
              Arrastra y suelta tus archivos aquí
            </p>
            <p className="text-sm text-gray-500 mb-4">
              o haz clic para seleccionarlos
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileSelection}
            />
            <label
              htmlFor="file-upload"
              className="mt-3 inline-block px-6 py-3 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 shadow cursor-pointer transition-all duration-200"
            >
              Seleccionar archivos
            </label>
          </div>

          {files.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
                Archivos seleccionados:
              </h3>
              <ul className="space-y-3 m-0 p-0">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 shadow-md rounded-lg px-4 py-3 hover:bg-gray-200 transition-all duration-200"
                  >
                    <span className="text-sm text-gray-800 truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 text-sm font-semibold hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  onClick={uploadFiles}
                  className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 shadow-lg transition-all duration-200"
                >
                  Subir a S3
                </button>
              </div>
            </>
          )}

          {s3Files.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mt-10 mb-4">
                Archivos en S3:
              </h3>
              <ul className="space-y-3 m-0 p-0">
                {s3Files.map((file, index) => {
                  const fileName = file.Key.split("/").pop();
                  const fileUrl = `https://${bucketName}.s3.amazonaws.com/${file.Key}`;
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 shadow-md rounded-lg px-4 py-3 hover:bg-gray-200 transition-all duration-200"
                    >
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-semibold hover:underline truncate"
                      >
                        {fileName}
                      </a>
                      <button
                        onClick={() => deleteS3File(file.Key)}
                        className="text-red-600 text-sm font-semibold hover:underline"
                      >
                        Eliminar
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {loading && (
            <p className="text-center text-gray-500 mt-6 text-sm">
              Procesando...
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
