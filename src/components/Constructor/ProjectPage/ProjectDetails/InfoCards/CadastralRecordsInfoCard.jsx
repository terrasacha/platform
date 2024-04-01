import React, { useEffect, useRef, useState } from "react";

import Card from "../../../../common/Card";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { EditIcon } from "components/common/icons/EditIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { notify } from "../../../../../utilities/notify";
import { API, Storage, graphqlOperation } from "aws-amplify";
import Swal from "sweetalert2";
import {
  createDocument,
  createProductFeature,
  deleteDocument,
  deleteProductFeature,
  deleteVerification,
  deleteVerificationComment,
  updateDocument,
  updateProductFeature,
} from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { fetchProjectDataByProjectID } from "../../api";
import WebAppConfig from "components/common/_conf/WebAppConfig";
import { XIcon } from "components/common/icons/XIcon";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";

export default function CadastralRecordsInfoCard(props) {
  const { className, autorizedUser, setProgressChange, tooltip, setTotalArea } =
    props;
  const {
    projectData,
    handleUpdateContextProjectCadastralRecordsData,
    handleUpdateContextProjectFile,
    handleSetContextProjectFile,
  } = useProjectData();
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [multipleData, setMultipleData] = useState([]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [cadastralData, setCadastralDataPfID] = useState(null);
  const [predialFetchedData, setPredialFetchedData] = useState({});

  useEffect(() => {
    if (projectData && projectData.projectCadastralRecords) {
      let ownersData =
        [...projectData.projectCadastralRecords.cadastralRecords].map(
          (cadastralData) => {
            return {
              ...cadastralData,
              editing: false,
            };
          }
        ) || [];

      setCadastralDataPfID(projectData.projectCadastralRecords.pfID);
      setMultipleData(ownersData);
    }
  }, [projectData]);

  useEffect(() => {
    async function updatePredialData() {
      const cadastralNumbersArray = multipleData.map((item) =>
        item.cadastralNumber.trim()
      );
      // Información predial
      const predialData = await getPredialDataByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      console.log("predialData", predialData);
      setPredialFetchedData(predialData);

      // Área total del predio
      let suma = 0;

      for (const key in predialData) {
        if (predialData.hasOwnProperty(key)) {
          const elemento = predialData[key];
          suma += elemento.AREA_TERRENO;
        }
      }
      setTotalArea(suma);
    }

    if (multipleData.length > 0 && !executedOnce) {
      updatePredialData();
      setExecutedOnce(true);
    }
    if (multipleData.length > 0 && executedOnce) {
      const obj = multipleData.filter((data) => data.editing === true)[0];
      console.log(obj);

      if (obj) {
        let cadastralNumberLength = obj.cadastralNumber.length;
        if (cadastralNumberLength === 20 || cadastralNumberLength === 30) {
          updatePredialData();
        }
      }
    }
  }, [multipleData]);

  const handleFileChange = (e, indexToSaveFile) => {
    setMultipleData((prevState) =>
      prevState.map((item, index) =>
        index === indexToSaveFile
          ? { ...item, certificate: e.target.files[0] }
          : item
      )
    );
  };

  const handleUploadButton = (index) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Este archivo será cargado y enviado a validación!",
      showCancelButton: true,
      confirmButtonText: "Cargar archivo",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fileInputRef.current.click();
      }
    });
  };

  const handleEditHistoricalData = async (indexToStartEditing) => {
    const isEditingSomeHistoryData = multipleData.some(
      (cadastralData) => cadastralData.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setMultipleData((prevState) =>
        prevState.map((item, index) =>
          index === indexToStartEditing ? { ...item, editing: true } : item
        )
      );
    } else {
      notify({
        msg: "Termina la edición antes de realizar una nueva",
        type: "error",
      });
    }
  };

  const handleChangeInputValue = async (e) => {
    const { name, value } = e.target;

    if (name.includes("cadastraldata_")) {
      const [_, multipleDataFeature, multipleDataIndex] = name.split("_");

      setMultipleData((prevState) =>
        prevState.map((item, index) =>
          index === parseInt(multipleDataIndex)
            ? { ...item, [multipleDataFeature]: value }
            : item
        )
      );
    }
  };

  const handleAddNewPeriodToHistoricalData = async () => {
    const isEditingSomeHistoryData = multipleData.some(
      (cadastralData) => cadastralData.editing === true
    );
    if (!isEditingSomeHistoryData) {
      setMultipleData((prevState) => {
        return [
          ...prevState,
          {
            name: "",
            cadastralNumber: "",
            matricula: "",
            certificate: null,
            editing: true,
          },
        ];
      });
    } else {
      notify({
        msg: "Guarda primero los datos antes de agregar una nueva fila",
        type: "error",
      });
    }
  };

  function getImportantValues(cadastralDataFixed) {
    return cadastralDataFixed.map((cadastralData) => {
      return {
        cadastralNumber: cadastralData.cadastralNumber.trim(),
        matricula: cadastralData.matricula,
        documentID: cadastralData.documentID,
      };
    });
  }

  const formatFileName = (fileName) => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
    const formattedFilename = fileName
      .toLowerCase()
      .trim()
      .replaceAll(" ", "_");
    const filenameWithoutAccents = removeAccents(formattedFilename);
    return encodeURIComponent(filenameWithoutAccents);
  };

  const saveFileOnDB = async (fileToSave, documentID = null) => {
    let docID = documentID;
    const urlPath = `${
      projectData.projectInfo.id
    }/archivos_postulante/certificados_tradicion/${formatFileName(
      fileToSave.name
    )}`;

    if (documentID) {
      const oldDocument = projectData.projectFiles.find(
        (item) => item.id === documentID
      );
      // Si toca actualizar
      const getFilePathRegex = /\/public\/(.+)$/;

      // Eliminar archivo viejo de S3
      const fileToDeleteName = decodeURIComponent(
        oldDocument.url.match(getFilePathRegex)[1]
      );
      try {
        await Storage.remove(fileToDeleteName);
      } catch (error) {
        console.error("Error removing the file:", error);
      }

      //  Cargar archivo nuevo a S3
      try {
        const uploadImageResult = await Storage.put(urlPath, fileToSave, {
          level: "public",
          contentType: "*/*",
        });

        console.log("Archivo seleccionado:", fileToSave);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        return;
      }

      // Actualizar base de datos (Product Feature y Documento)
      const updatedProductFeature = {
        id: oldDocument.pfID,
        value: fileToSave.name,
      };
      console.log("updatedProductFeature:", updatedProductFeature);
      await API.graphql(
        graphqlOperation(updateProductFeature, { input: updatedProductFeature })
      );

      const updatedDocument = {
        id: oldDocument.id,
        timeStamp: Date.now(),
        status: "pending",
        isApproved: false,
        isUploadedToBlockChain: false,
        url: WebAppConfig.url_s3_public_images + urlPath,
      };

      await API.graphql(
        graphqlOperation(updateDocument, { input: updatedDocument })
      );
    } else {
      // Crear pf y document
      try {
        const uploadImageResult = await Storage.put(urlPath, fileToSave, {
          level: "public",
          contentType: "*/*",
        });

        console.log("Archivo seleccionado:", fileToSave);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        return;
      }

      const newProductFeature = {
        featureID: "B_owner_certificado",
        productID: projectData.projectInfo.id,
        value: fileToSave.name,
      };
      console.log("newProductFeature:", newProductFeature);
      const createProductFeatureResponse = await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );

      const newDocument = {
        productFeatureID:
          createProductFeatureResponse.data.createProductFeature.id,
        userID: user.id,
        timeStamp: Date.now(),
        status: "pending",
        isApproved: false,
        isUploadedToBlockChain: false,
        url: WebAppConfig.url_s3_public_images + urlPath,
      };

      const createDocumentResponse = await API.graphql(
        graphqlOperation(createDocument, { input: newDocument })
      );

      docID = createDocumentResponse.data.createDocument.id;
    }
    return docID;
  };

  const handleSaveHistoricalData = async (indexToSave) => {
    let error = false;
    const newCadastralNumber = multipleData[indexToSave].cadastralNumber;
    const certificate = multipleData[indexToSave].certificate;
    // const count = projectData.projectInfo.token.historicalData.reduce((acc, hd) => (hd.period === multipleData[indexToSave].period ? acc + 1 : acc), 0);
    const isAlreadyExistingCadastralNumber =
      projectData.projectCadastralRecords.cadastralRecords.some(
        (cd, index) =>
          cd.cadastralNumber === newCadastralNumber && index !== indexToSave
      );

    if (isAlreadyExistingCadastralNumber) {
      notify({
        msg: "El periodo que intentas guardar ya esta definido",
        type: "error",
      });
      return;
    }

    if (multipleData[indexToSave].cadastralNumber) {
      let documentID = multipleData[indexToSave].documentID;
      let docID = null;
      if (certificate) {
        docID = await saveFileOnDB(
          certificate,
          documentID !== undefined ? documentID : null
        );
        setMultipleData((prevState) =>
          prevState.map((item, index) =>
            index === indexToSave
              ? {
                  ...item,
                  documentID: docID,
                  editing: false,
                  updatedAt: Date.now(),
                }
              : item
          )
        );
      } else {
        setMultipleData((prevState) =>
          prevState.map((item, index) =>
            index === indexToSave
              ? {
                  ...item,
                  editing: false,
                  updatedAt: Date.now(),
                }
              : item
          )
        );
      }

      let tempMD = multipleData;
      let tempMultipleData;

      if (certificate) {
        tempMultipleData = tempMD.map((item, index) =>
          index === indexToSave
            ? {
                ...item,
                documentID: docID,
                editing: false,
                updatedAt: Date.now(),
              }
            : item
        );
      } else {
        tempMultipleData = tempMD.map((item, index) =>
          index === indexToSave
            ? {
                ...item,
                editing: false,
                updatedAt: Date.now(),
              }
            : item
        );
      }

      setMultipleData((prevState) =>
        prevState.map((item, index) =>
          index === indexToSave
            ? {
                ...item,
                editing: false,
                updatedAt: Date.now(),
              }
            : item
        )
      );

      if (cadastralData) {
        let tempProductFeature = {
          id: cadastralData,
          value: JSON.stringify(getImportantValues(tempMultipleData)),
        };
        const response = await API.graphql(
          graphqlOperation(updateProductFeature, { input: tempProductFeature })
        );

        if (!response.data.updateProductFeature) error = true;
      } else {
        let tempProductFeature = {
          value: JSON.stringify(getImportantValues(tempMultipleData)),
          isToBlockChain: false,
          isOnMainCard: false,
          productID: projectData.projectInfo.id,
          featureID: "A_predio_ficha_catastral",
        };
        const response = await API.graphql(
          graphqlOperation(createProductFeature, { input: tempProductFeature })
        );

        setCadastralDataPfID(response.data.createProductFeature.id);

        if (!response.data.createProductFeature) error = true;
      }

      const updatedProjectData = await fetchProjectDataByProjectID(
        projectData.projectInfo.id
      );

      const mappedDocument = updatedProjectData.projectFiles.find(
        (item) => item.id === docID
      );

      const projectCadastralRecordsData =
        updatedProjectData.projectCadastralRecords;

      if (certificate) {
        await handleUpdateContextProjectFile(docID, mappedDocument);
      }
      await handleUpdateContextProjectCadastralRecordsData(
        projectCadastralRecordsData
      );
    } else {
      notify({
        msg: "Completa todos los campos antes de guardar",
        type: "error",
      });
      return;
    }

    if (!error) {
      setProgressChange(true);
      notify({
        msg: "Propietarios guardados exitosamente",
        type: "success",
      });
    }
  };

  const handleDeleteHistoricalData = async (indexToDelete) => {
    let error = false;

    const documentToDelete = projectData.projectFiles.find(
      (item) => item.id === multipleData[indexToDelete].documentID
    );

    if (documentToDelete) {
      // Borrar de S3
      const getFilePathRegex = /\/public\/(.+)$/;

      const fileToDeleteName = decodeURIComponent(
        documentToDelete.url.match(getFilePathRegex)[1]
      );
      try {
        await Storage.remove(fileToDeleteName);
      } catch (error) {
        console.error("Error removing the file:", error);
      }

      // Borrar product feature del documento
      const pfToDelete = {
        id: documentToDelete.pfID,
      };
      await API.graphql(
        graphqlOperation(deleteProductFeature, { input: pfToDelete })
      );

      // Borrar documento
      const docToDelete = {
        id: documentToDelete.id,
      };
      await API.graphql(
        graphqlOperation(deleteDocument, { input: docToDelete })
      );

      if (documentToDelete.verification) {
        // Borrar verification (si existe)
        const verificationToDelete = {
          id: documentToDelete.verification.id,
        };
        await API.graphql(
          graphqlOperation(deleteVerification, { input: verificationToDelete })
        );

        // Borrar verification comments (si existe)
        if (documentToDelete.verification.messages.length > 0) {
          documentToDelete.verification.messages.forEach(async (item) => {
            const verificationCommentToDelete = {
              id: item.id,
            };
            await API.graphql(
              graphqlOperation(deleteVerificationComment, {
                input: verificationCommentToDelete,
              })
            );
          });
        }
      }
    }

    // Actualizar multipleData
    const tempMultipleData = multipleData.filter(
      (_, index) => index !== indexToDelete
    );
    setMultipleData(tempMultipleData);

    if (cadastralData) {
      let tempProductFeature = {
        id: cadastralData,
        value: JSON.stringify(getImportantValues(tempMultipleData)),
      };
      const response = await API.graphql(
        graphqlOperation(updateProductFeature, { input: tempProductFeature })
      );

      if (!response.data.updateProductFeature) error = true;
    } else {
      let tempProductFeature = {
        value: JSON.stringify(getImportantValues(tempMultipleData)),
        isToBlockChain: false,
        isOnMainCard: false,
        productID: projectData.projectInfo.id,
        featureID: "A_predio_ficha_catastral",
      };
      const response = await API.graphql(
        graphqlOperation(createProductFeature, { input: tempProductFeature })
      );
      setCadastralDataPfID(response.data.createProductFeature.id);

      if (!response.data.createProductFeature) error = true;
    }

    const updatedProjectData = await fetchProjectDataByProjectID(
      projectData.projectInfo.id
    );

    const projectCadastralRecordsData =
      updatedProjectData.projectCadastralRecords;

    await handleUpdateContextProjectCadastralRecordsData(
      projectCadastralRecordsData
    );
    await handleSetContextProjectFile(updatedProjectData.projectFiles);

    if (!error) {
      setProgressChange(true);
      notify({
        msg: "Valores borrados exitosamente",
        type: "success",
      });
    }
  };

  const renderFileLinkByDocumentID = (documentID) => {
    if (documentID) {
      const document = projectData.projectFiles.find(
        (item) => item.id === documentID
      );
      return (
        <a href={document?.url} target="_blank" rel="noreferrer">
          Archivo
        </a>
      );
    } else {
      return "Sin archivo";
    }
  };

  const renderAreaByCadastralNumber = (cadastralNumber) => {
    const cadNum = cadastralNumber.trim();
    if (cadNum in predialFetchedData) {
      return (
        parseFloat(predialFetchedData[cadNum].area).toLocaleString("es-ES") +
        " m2"
      );
    } else {
      return "...";
    }
  };

  const renderPredioNameByCadastralNumber = (cadastralNumber) => {
    const cadNum = cadastralNumber.trim();
    if (cadNum in predialFetchedData) {
      return predialFetchedData[cadNum].predio;
    } else {
      return "...";
    }
  };

  return (
    <Card className={className}>
      <Card.Header title="Información predial" sep={true} tooltip={tooltip} />
      <Card.Body>
        <div className="row">
          <Table responsive>
            <thead className="text-center">
              <tr>
                <th style={{ width: "240px" }}>Identificador catastral</th>
                <th style={{ width: "180px" }}>Matrícula inmobiliaria</th>
                <th style={{ width: "180px" }}>Certificado de tradición</th>
                <th style={{ width: "180px" }}>Nombre de predio</th>
                <th style={{ width: "180px" }}>Área</th>
                <th style={{ width: "120px" }}></th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {multipleData.map((data, index) => {
                return (
                  <tr key={index} className="text-center">
                    {data.editing ? (
                      <>
                        <td>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              size="sm"
                              type="text"
                              value={data.cadastralNumber}
                              className="text-center"
                              name={`cadastraldata_cadastralNumber_${index}`}
                              onInput={(e) => handleChangeInputValue(e)}
                            />
                            {data.cadastralNumber.trim() in
                            predialFetchedData ? (
                              <CheckIcon className="ms-2 text-success" />
                            ) : (
                              <XIcon className="ms-2 text-danger" />
                            )}
                          </div>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={data.matricula}
                            className="text-center"
                            name={`cadastraldata_matricula_${index}`}
                            onChange={(e) => handleChangeInputValue(e)}
                          />
                        </td>
                        <td>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                          <Button onClick={handleUploadButton} size="sm">
                            {data.certificate || data.documentID !== undefined
                              ? "Actualizar"
                              : "Cargar"}
                          </Button>
                        </td>
                        <td>
                          {renderPredioNameByCadastralNumber(
                            data.cadastralNumber
                          )}
                        </td>
                        <td>
                          {renderAreaByCadastralNumber(data.cadastralNumber)}
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="success"
                            className="m-1"
                            onClick={() => handleSaveHistoricalData(index)}
                          >
                            <SaveDiskIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="m-1"
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="text-break">
                          {data.cadastralNumber?.toUpperCase()}
                        </td>
                        <td className="text-break">{data.matricula}</td>
                        <td>{renderFileLinkByDocumentID(data.documentID)}</td>
                        <td className="text-break">
                          {renderPredioNameByCadastralNumber(
                            data.cadastralNumber
                          )}
                        </td>
                        <td>
                          {renderAreaByCadastralNumber(data.cadastralNumber)}
                        </td>
                        <td className="text-end">
                          <Button
                            size="sm"
                            variant="warning"
                            className="m-1"
                            disabled={!autorizedUser}
                            onClick={() => handleEditHistoricalData(index)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="m-1"
                            disabled={!autorizedUser}
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              <tr>
                <td colSpan={6}>
                  <div className="d-flex">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-100"
                      disabled={!autorizedUser}
                      onClick={() => handleAddNewPeriodToHistoricalData()}
                    >
                      <PlusIcon></PlusIcon>
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
