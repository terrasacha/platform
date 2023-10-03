import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useProjectData } from "context/ProjectDataContext";
import { Storage } from "aws-amplify";
import { AddFolderIcon } from "components/common/icons/AddFolderIcon";
import FormGroup from "components/common/FormGroup";

export default function NewFolderOnS3Modal(props) {
  const { uploadRoute } = props;
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { refresh } = useProjectData();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setNewFolderName("");
  };

  const makeFolderOnS3 = async (folderName) => {
    const folderPath = `${uploadRoute}/${folderName}/`;
    try {
      const folderResult = await Storage.put(folderPath, "", {
        level: "public",
        contentType: "application/x-directory",
      });
      refresh();
      console.log("folderPath", folderPath);
      console.log("folderResult", folderResult);
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      throw new Error("Error al crear la carpeta");
    }
    closeModal();
  };

  return (
    <div>
      <Button variant="primary" size="md" onClick={openModal}>
        <AddFolderIcon />
      </Button>

      <Modal show={showModal} onHide={closeModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo directorio</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            type="block"
            inputType="text"
            inputSize="md"
            label="Nombre"
            inputValue={newFolderName}
            onChangeInputValue={(e) => setNewFolderName(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={() => makeFolderOnS3(newFolderName)}
          >
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
