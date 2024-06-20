import React, { useState } from "react";

import { API, graphqlOperation, Storage } from "aws-amplify";
import Card from "../../../../common/Card";
import Spinner from "react-bootstrap/Spinner";
import { DownloadIcon } from "../../../../common/icons/DownloadIcon";
import { MessagesIcon } from "../../../../common/icons/MessagesIcon";
import { CheckIcon } from "../../../../common/icons/CheckIcon";
import { XIcon } from "../../../../common/icons/XIcon";
import {
  createVerification,
  updateDocument,
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
    handleSendMessage,
  } = props;
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const {
    handleUpdateContextDocumentStatus,
    handleUpdateContextFileVerification,
    projectData,
  } = useProjectData();
  const { user } = useAuth();

  const fileInputRef = React.createRef();

  const handleUpdateDocumentStatus = async (fileIndex, docId, status) => {
    const file = projectData.projectFiles[fileIndex];
    let verificationId;

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
      verificationId = verification.id;
      const localVerification = {
        id: verificationId,
        messages: [],
        postulantID: projectData.projectPostulant.id,
        postulantName: projectData.projectPostulant.name,
        verifierID: user.id,
        verifierName: user.name,
      };
      await handleUpdateContextFileVerification(fileIndex, localVerification);
    } else {
      verificationId = file.verification.id;
      if (file.verification.verifierID !== user.id) {
        notify({
          msg: "El archivo ya esta siendo validado por otro verificador",
          type: "error",
        });
        return;
      }
    }

    // En caso de que el proyecto no tenga ningun verificador, se actualiza el estado del proyecto a En Verificación
    // const isProjectOnVerification = projectData.projectFiles.filter(
    //   (proyectFile) => proyectFile.verification !== undefined
    // );
    // if (isProjectOnVerification.length === 0) {
    //   console.log("entro a actualizar a on_verification")
    //   await handleUpdateContextProjectInfo({ status: "En verificación" });

    //   await API.graphql(
    //     graphqlOperation(updateProduct, {
    //       input: {
    //         id: projectData.projectInfo.id,
    //         status: "on_verification",
    //       },
    //     })
    //   );
    // }

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
        await handleSendMessage("Tú archivo fue aceptado", verificationId);
        notify({
          msg: "El archivo fue aceptado",
          type: "success",
        });
      } else {
        await handleSendMessage(
          "Tú archivo fue rechazado, por favor sube un nuevo archivo con la documentación correcta",
          verificationId
        );
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
      return;
    }

    // En caso de que todos los documentos sean aprobados, se actualiza el estado del proyecto a Verificado
    // const approvedDocuments = projectData.projectFiles.filter(projectFile => projectFile.isApproved === true)
    // if(projectData.projectFiles.length === approvedDocuments.length + status ? 1 : 0) {
    //   console.log("entro a actualizar verified")
    //   await handleUpdateContextProjectInfo({ status: "Verificado" });

    //   await API.graphql(
    //     graphqlOperation(updateProduct, {
    //       input: {
    //         id: projectData.projectInfo.id,
    //         status: "verified",
    //       },
    //     })
    //   );
    // }
  };

  const handleUpdateDocumentFile = async (e, fileIndex, file) => {
    setIsLoadingDoc(true);

    const newFile = e.target.files[0];

    const getFilePathRegex = /\/public\/(.+)$/;

    const verificationId = file.verification.id;

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

      // Agregar comentario al componente de Messages
      await handleSendMessage(
        "Se ha subido un nuevo archivo, por favor verifícalo",
        verificationId
      );

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
            <button
              className="px-2 py-1 text-blue-500 rounded-md border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={() =>
                handleUpdateDocumentStatus(fileIndex, file.id, true)
              }
            >
              <CheckIcon />
            </button>
            <button
              className="px-2 py-1 text-white rounded-md bg-red-500"
              onClick={() =>
                handleUpdateDocumentStatus(fileIndex, file.id, false)
              }
            >
              <XIcon />
            </button>
          </>
        );
      } else {
        return (
          <button
            className="px-2 py-1 text-blue-500 rounded-md border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white"
            onClick={() => setIsValidating(true)}
          >
            Verificar
          </button>
        );
      }
    } else {
      return statusMap[file.status];
    }
  };

  return (
    <Card className={className}>
      <Card.Header title="Documentos del postulante" sep="true" />
      <Card.Body>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ultima actualización</th>
              <th>Estado Validación</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {projectFiles?.map((file, fileIndex) => {
              return (
                <tr
                  key={file.id}
                  className="border-b-2"
                  style={{ height: "4rem" }}
                >
                  <td>{file.title}</td>
                  <td>{file.updatedAt}</td>
                  <td>{getValidationRender(file, fileIndex)}</td>
                  <td className="text-end flex justify-end items-center h-[4rem] gap-x-2">
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
                        <button
                          className="px-2 py-1 text-blue-500 rounded-md border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white"
                          onClick={() => handleUploadDocumentButtonClick()}
                        >
                          {isLoadingDoc ? (
                            <Spinner size="sm" className="p-2"></Spinner>
                          ) : (
                            "Actualizar documentación"
                          )}
                        </button>
                      </>
                    )}
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <button className="px-2 py-1 rounded-md border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white">
                        <DownloadIcon />
                      </button>
                    </a>
                    {file.verification && (
                      <button
                        className="px-2 py-1 text-blue-500 rounded-md border-[1px] border-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => handleMessageButtonClick(fileIndex)}
                      >
                        <MessagesIcon />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
}
