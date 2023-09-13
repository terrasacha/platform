import React, { useState } from "react";

import { API, graphqlOperation, Storage } from "aws-amplify";
import Card from "../../../../common/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { DownloadIcon } from "../../../../common/icons/DownloadIcon";
import { MessagesIcon } from "../../../../common/icons/MessagesIcon";
import { CheckIcon } from "../../../../common/icons/CheckIcon";
import { XIcon } from "../../../../common/icons/XIcon";
import {
  createVerification,
  updateDocument,
  updateProduct,
} from "../../../../../graphql/mutations";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { useAuth } from "../../../../../context/AuthContext";
import { notify } from "../../../../../utilities/notify";

export default function PostulantFilesInfoCard(props) {
  const {
    className,
    projectFiles,
    handleMessageButtonClick,
    setIsDocApproved,
    isVerifier,
    isPostulant,
  } = props;
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const {
    handleUpdateContextDocumentStatus,
    handleUpdateContextFileVerification,
    handleUpdateContextProjectInfo,
    projectData,
  } = useProjectData();
  const { user } = useAuth();

  const fileInputRef = React.createRef();

  const handleUpdateDocumentStatus = async (fileIndex, docId, status) => {
    const file = projectData.projectFiles[fileIndex];
    if (!file.verification) {
      const newVerification = {
        productFeatureID: file.pfID,
        userVerifierID: user.id,
        userVerifiedID: projectData.projectPostulant.id,
      };

      console.log(newVerification);

      const createVerificationResult = await API.graphql(
        graphqlOperation(createVerification, {
          input: newVerification,
        })
      );

      const verification = createVerificationResult.data.createVerification;
      const localVerification = {
        id: verification.id,
        messages: [],
        postulantID: projectData.projectPostulant.id,
        postulantName: projectData.projectPostulant.name,
        verifierID: user.id,
        verifierName: user.name,
      };
      await handleUpdateContextFileVerification(fileIndex, localVerification);
    } else {
      if (file.verification.verifierID !== user.id) {
        notify({
          msg: "El archivo ya fue asignado a otro verificador",
          type: "error",
        });
        return;
      }
    }

    // En caso de que el proyecto no tenga ningun verificador, se actualiza el estado del proyecto a En Verificación
    const isProjectOnVerification = projectData.projectFiles.filter(
      (proyectFile) => proyectFile.verification !== undefined
    );
    if (isProjectOnVerification.length === 0) {
      console.log("entro a actualizar a on_verification")
      await handleUpdateContextProjectInfo({ status: "En verificación" });

      await API.graphql(
        graphqlOperation(updateProduct, {
          input: {
            id: projectData.projectInfo.id,
            status: "on_verification",
          },
        })
      );
    }

    // Actualización de estado de documento
    const updateDocumentStatus = {
      id: docId,
      isApproved: status,
      status: status ? "accepted" : "denied",
    };
    try {
      await API.graphql(
        graphqlOperation(updateDocument, {
          input: updateDocumentStatus,
        })
      );

      await handleUpdateContextDocumentStatus(fileIndex, {
        isApproved: status,
        status: status ? "accepted" : "denied",
      });
      setIsValidating(false);
      setIsDocApproved(status);

      if (status) {
        notify({
          msg: "El archivo fue aceptado",
          type: "success",
        });
      } else {
        notify({
          msg: "El archivo fue rechazado, el postulante deberá subir un nuevo archivo",
          type: "success",
        });
      }
      
    } catch (error) {
      notify({
        msg: "Ups!, parece que algo ha fallado",
        type: "error",
      });
      return
    }

    // En caso de que todos los documentos sean aprobados, se actualiza el estado del proyecto a Verificado
    const approvedDocuments = projectData.projectFiles.filter(projectFile => projectFile.isApproved === true)
    if(projectData.projectFiles.length === approvedDocuments.length + status ? 1 : 0) {
      console.log("entro a actualizar verified")
      await handleUpdateContextProjectInfo({ status: "Verificado" });

      await API.graphql(
        graphqlOperation(updateProduct, {
          input: {
            id: projectData.projectInfo.id,
            status: "verified",
          },
        })
      );
    }
  };

  const handleUpdateDocumentFile = async (e, fileIndex, file) => {
    setIsLoadingDoc(true);

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
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        setIsLoadingDoc(false);
        return;
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
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        setIsLoadingDoc(false);
        return;
      }

      await handleUpdateContextDocumentStatus(fileIndex, {
        isApproved: false,
        status: "pending",
      });

      notify({
        msg: "Archivo subido y enviado a validación exitosamente",
        type: "success",
      });
    }

    e.target.value = "";
    setIsLoadingDoc(false);
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
      <Card.Header title="Documentos del postulante" sep="true"/>
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
                          onChange={(e) =>
                            handleUpdateDocumentFile(e, fileIndex, file)
                          }
                        />
                        <Button
                          className="m-1"
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleUploadDocumentButtonClick()}
                        >
                          {isLoadingDoc ? (
                            <Spinner size="sm" className="p-2"></Spinner>
                          ) : (
                            "Actualizar documentación"
                          )}
                        </Button>
                      </>
                    )}
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <Button
                        className="m-1"
                        size="sm"
                        variant="outline-primary"
                      >
                        <DownloadIcon />
                      </Button>
                    </a>
                    {file.verification && (
                      <Button
                        className="m-1"
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleMessageButtonClick(fileIndex)}
                      >
                        <MessagesIcon />
                      </Button>
                    )}
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
