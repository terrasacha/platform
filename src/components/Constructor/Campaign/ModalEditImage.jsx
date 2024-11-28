import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Storage, API, graphqlOperation } from "aws-amplify";
import awsmobile from "aws-exports"; // Ajusta la ruta si es necesario
import { updateCampaign } from "graphql/mutations";
import { toast } from "sonner";

const ModalEditImage = ({ show, handleClose, campaignId, fetchCampaign }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!file) {
      alert("Por favor selecciona una imagen");
      return;
    }

    setUploading(true);
    try {
      // Subir el archivo a S3
      const fileName = `campaigns/${campaignId}/${file.name}`;
      const result = await Storage.put(fileName, file, {
        contentType: file.type,
      });

      // Obtener la URL pública de la imagen usando los datos de aws-exports.js
      const bucketName = awsmobile.aws_user_files_s3_bucket;
      const region = awsmobile.aws_user_files_s3_bucket_region;
      const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/public/${result.key}`;

      // Actualizar la campaña con la nueva URL de la imagen
      await API.graphql(
        graphqlOperation(updateCampaign, {
          input: {
            id: campaignId,
            images: JSON.stringify([imageUrl]), // Reemplazar con la nueva URL
          },
        })
      );

      // Actualizar la campaña en la interfaz
      fetchCampaign();
      toast.success("Imagen actualizada con éxito");
      handleClose();
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Imagen</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        {uploading && <Spinner animation="border" className="mt-3" />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={uploading}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditImage;
