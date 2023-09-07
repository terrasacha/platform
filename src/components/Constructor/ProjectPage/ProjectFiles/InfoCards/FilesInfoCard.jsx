import React, { useState } from "react";

import { API, graphqlOperation } from "aws-amplify";
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
  const { className, projectFiles, handleMessageButtonClick, setIsDocApproved, isVerifier } = props;
  const [isValidating, setIsValidating] = useState(false);
  const { handleUpdateContextDocumentStatus } = useProjectData()

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
    handleUpdateContextDocumentStatus(fileIndex, status)
    setIsValidating(false)
    setIsDocApproved(status)
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
              onClick={() => handleUpdateDocumentStatus(fileIndex, file.id, true)}
            >
              <CheckIcon />
            </Button>
            <Button
              className="m-1 scale-up-ver-top"
              size="sm"
              variant="danger"
              onClick={() => handleUpdateDocumentStatus(fileIndex, file.id, false)}
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
        <Table className="text-center">
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
                      onClick={() =>
                        handleMessageButtonClick(fileIndex)
                      }
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
