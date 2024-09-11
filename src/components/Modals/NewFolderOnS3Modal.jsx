import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useProjectData } from "context/ProjectDataContext";
import { Storage } from "aws-amplify";
import { AddFolderIcon } from "components/common/icons/AddFolderIcon";
import FormGroup from "components/common/FormGroup";
import { makeFolderOnS3 } from "utilities/makeFolderOnS3";

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

  const handleCreateFolderOnS3 = async (folderName) => {
    const folderPath = `${uploadRoute}/${folderName}/`;

    await makeFolderOnS3(folderPath);

    refresh();
    closeModal();
  };

  return (
    <div>
      <button
        className="p-2 text-white bg-blue-600 rounded-md"
        onClick={openModal}
      >
        <AddFolderIcon />
      </button>

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
          <button
            className="p-2 text-white bg-slate-700 rounded-md"
            onClick={closeModal}
          >
            Cerrar
          </button>
          <button
            className="p-2 text-white bg-blue-600 rounded-md"
            onClick={() => handleCreateFolderOnS3(newFolderName)}
          >
            Crear
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
