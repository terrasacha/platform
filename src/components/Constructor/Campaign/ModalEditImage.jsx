import { useState, useRef, useCallback } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Storage, API, graphqlOperation } from "aws-amplify";
import awsmobile from "aws-exports";
import { updateCampaign } from "graphql/mutations";
import { toast } from "react-toastify";
import { FiUpload, FiImage, FiX, FiCheck } from "react-icons/fi";

const ModalEditImage = ({ show, handleClose, campaignId, fetchCampaign }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Validar tipo de archivo
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten archivos de imagen (JPG, PNG, WebP, GIF)";
    }

    if (file.size > maxSize) {
      return "El archivo es demasiado grande. Máximo 5MB";
    }

    return null;
  };

  // Manejar archivo seleccionado
  const handleFile = (selectedFile) => {
    setError("");
    
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag & Drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Click en el área de drop
  const handleDropClick = () => {
    fileInputRef.current?.click();
  };

  // Cambio de archivo por input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Limpiar archivo
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  // Guardar imagen
  const handleSave = async () => {
    if (!file) {
      setError("Por favor selecciona una imagen");
      return;
    }

    setUploading(true);
    try {
      // Subir el archivo a S3
      const fileName = `campaigns/${campaignId}/${Date.now()}_${file.name}`;
      const result = await Storage.put(fileName, file, {
        contentType: file.type,
      });

      // Obtener la URL pública de la imagen
      const bucketName = awsmobile.aws_user_files_s3_bucket;
      const region = awsmobile.aws_user_files_s3_bucket_region;
      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public/${result.key}`;

      // Actualizar la campaña con la nueva URL de la imagen
      await API.graphql(
        graphqlOperation(updateCampaign, {
          input: {
            id: campaignId,
            images: JSON.stringify([imageUrl]),
          },
        })
      );

      // Actualizar la campaña en la interfaz
      fetchCampaign();
      toast.success("Imagen actualizada con éxito");
      handleClose();
      clearFile();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  // Cerrar modal y limpiar
  const handleModalClose = () => {
    clearFile();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="font-champagne text-2xl text-terrasacha-secondary1">
          Actualizar Imagen de Campaña
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-6">
        {/* Área de Drag & Drop */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? "border-terrasacha-primary bg-terrasacha-primary/5"
              : preview
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 bg-gray-50 hover:border-terrasacha-primary hover:bg-terrasacha-primary/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleDropClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {!preview ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-terrasacha-primary/10 rounded-full flex items-center justify-center">
                <FiUpload className="w-8 h-8 text-terrasacha-primary" />
              </div>
              <div>
                <p className="text-lg font-typographica font-semibold text-gray-700">
                  Arrastra tu imagen aquí
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  o haz clic para buscar en tu dispositivo
                </p>
              </div>
              <div className="text-xs text-gray-400">
                JPG, PNG, WebP, GIF • Máximo 5MB
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-lg shadow-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{file?.name}</p>
                <p className="text-gray-500">
                  {(file?.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <FiX className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <FiImage className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Consejos para una mejor imagen:</p>
              <ul className="mt-2 space-y-1 text-blue-600">
                <li>• Usa imágenes de alta resolución (mínimo 1200x800px)</li>
                <li>• Formatos recomendados: JPG o PNG</li>
                <li>• Mantén una relación de aspecto horizontal</li>
                <li>• Evita texto pequeño que no se pueda leer</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline-secondary"
            onClick={handleModalClose}
            className="px-6 py-2 font-typographica font-medium"
          >
            Cancelar
          </Button>
          
          <div className="flex items-center space-x-3">
            {uploading && (
              <div className="flex items-center space-x-2 text-terrasacha-primary">
                <Spinner animation="border" size="sm" />
                <span className="text-sm">Subiendo...</span>
              </div>
            )}
            
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!file || uploading || !!error}
              className="px-6 py-2 bg-terrasacha-primary border-terrasacha-primary hover:bg-terrasacha-secondary1 hover:border-terrasacha-secondary1 font-typographica font-medium transition-all duration-200"
            >
              {uploading ? (
                <span className="flex items-center space-x-2">
                  <Spinner animation="border" size="sm" />
                  <span>Guardando...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4" />
                  <span>Guardar Imagen</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditImage;
