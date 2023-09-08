import React, { useState } from "react";

import { API, graphqlOperation, Storage } from "aws-amplify";
import Card from "../../../../common/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { DownloadIcon } from "../../../../common/icons/DownloadIcon";
import { MessagesIcon } from "../../../../common/icons/MessagesIcon";
import { CheckIcon } from "../../../../common/icons/CheckIcon";
import { XIcon } from "../../../../common/icons/XIcon";
import { updateDocument } from "../../../../../graphql/mutations";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function FilesInfoCard(props) {
  const {
    className,
    projectFiles,
    handleMessageButtonClick,
    setIsDocApproved,
    isVerifier,
    isPostulant,
  } = props;
  const [isValidating, setIsValidating] = useState(false);
  const { handleUpdateContextDocumentStatus } = useProjectData();

  const fileInputRef = React.createRef();

  const handleUpdateDocumentStatus = async (fileIndex, docId, status) => {
    const updateDocumentStatus = {
      id: docId,
      isApproved: status,
      status: status ? "accepted" : "denied",
    };
    await API.graphql(
      graphqlOperation(updateDocument, {
        input: updateDocumentStatus,
      })
    );
    handleUpdateContextDocumentStatus(fileIndex, {
      isApproved: status,
      status: status ? "accepted" : "denied",
    });
    setIsValidating(false);
    setIsDocApproved(status);
  };

  const handleUpdateDocument = async (e, fileIndex, file) => {
    const newFile = e.target.files[0];

    const getFilePathRegex = /\/public\/(.+)$/;

    if (newFile) {
      const fileToDeleteName = decodeURIComponent(
        file.url.match(getFilePathRegex)[1]
      );

      try {
        const uploadImageResult = await Storage.put(fileToDeleteName, newFile, {
          level: "public",
          contentType: "*/*",
        });

        console.log("Archivo seleccionado:", newFile);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        console.log("error", error);
        return
      }

      const tempUpdatedDocument = {
        id: file.id,
        isApproved: false,
        status: "pending",
        timeStamp: Date.now(),
      };
      try {
        await API.graphql(
          graphqlOperation(updateDocument, { input: tempUpdatedDocument })
        );
      } catch (error) {
        console.log("error", error);
        return
      }

      
      handleUpdateContextDocumentStatus(fileIndex, {
        isApproved: false,
        status: "pending",
      });

      e.target.value = "";
    }
  };

  const handleUploadDocumentButtonClick = async () => {
    fileInputRef.current.click();
  };

  const getValidationRender = (file, fileIndex) => {
    const statusMap = {
      pending: "Pendiente",
      accepted: "Aceptado",
      denied: "Negado",
    };
    if (file.status === "pending" && isVerifier) {
      if (isValidating) {
        return (
          <>
            <Button
              className="m-1 scale-up-ver-top"
              size="sm"
              variant="primary"
              onClick={() =>
                handleUpdateDocumentStatus(fileIndex, file.id, true)
              }
            >
              <CheckIcon />
            </Button>
            <Button
              className="m-1 scale-up-ver-top"
              size="sm"
              variant="danger"
              onClick={() =>
                handleUpdateDocumentStatus(fileIndex, file.id, false)
              }
            >
              <XIcon />
            </Button>
          </>
        );
      } else {
        return (
          <Button
            className="m-1"
            size="sm"
            variant="outline-primary"
            onClick={() => setIsValidating(true)}
          >
            Verificar
          </Button>
        );
      }
    } else {
      return statusMap[file.status];
    }
  };

  return (
    <Card className={className}>
      <Card.Body>
        <Table className="text-center" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ultima actualización</th>
              <th>Estado Validación</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {projectFiles?.map((file, fileIndex) => {
              return (
                <tr key={file.id}>
                  <td>{file.title}</td>
                  <td>{file.updatedAt}</td>
                  <td>{getValidationRender(file, fileIndex)}</td>
                  <td className="text-end">
                    {isPostulant && file.status === "denied" && (
                      <>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={(e) => handleUpdateDocument(e, fileIndex, file)}
                        />
                        <Button
                          className="m-1"
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleUploadDocumentButtonClick()}
                        >
                          Actualizar documentación
                        </Button>
                      </>
                    )}
                    <a href={file.url}>
                      <Button
                        className="m-1"
                        size="sm"
                        variant="outline-primary"
                      >
                        <DownloadIcon />
                      </Button>
                    </a>
                    <Button
                      className="m-1"
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleMessageButtonClick(fileIndex)}
                    >
                      <MessagesIcon />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
