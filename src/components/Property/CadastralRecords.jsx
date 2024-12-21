import React, { useEffect, useRef, useState } from "react";

import { TrashIcon } from "components/common/icons/TrashIcon";
import { EditIcon } from "components/common/icons/EditIcon";
import { SaveDiskIcon } from "components/common/icons/SaveDiskIcon";
import { PlusIcon } from "components/common/icons/PlusIcon";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { handleOpenObject } from "utilities/s3clientcommands";
// s3Client
import { useS3Client } from "context/s3ClientContext";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// s3Client
import Swal from "sweetalert2";
import {
  createDocument,
  createPropertyFeature,
  updateDocument,
  updatePropertyFeature,
} from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import WebAppConfig from "components/common/_conf/WebAppConfig";
import { XIcon } from "components/common/icons/XIcon";
import { CheckIcon } from "components/common/icons/CheckIcon";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { usePropertyData } from "context/PropertyDataContext";
import { notify } from "utilities/notify";
import { fetchPropertyDataByPropertyID } from "components/Constructor/ProjectPage/api";
import Card from "components/common/Card";

export default function CadastralRecords(props) {
  const { className, autorizedUser, tooltip, setTotalArea, totalArea } = props;
  const { propertyData, refresh } = usePropertyData();
  const { user } = useAuth();
  const { s3Client, bucketName } = useS3Client();
  const fileInputRef = useRef(null);

  const [multipleData, setMultipleData] = useState([]);
  const [executedOnce, setExecutedOnce] = useState(false);
  const [cadastralData, setCadastralDataPfID] = useState(null);
  const [areaDataPfID, setAreaDataPfID] = useState(null);
  const [predialFetchedData, setPredialFetchedData] = useState({});

  useEffect(() => {
    if (propertyData && propertyData.projectCadastralRecords) {
      let ownersData =
        [...propertyData.projectCadastralRecords.cadastralRecords].map(
          (cadastralData) => {
            return {
              ...cadastralData,
              editing: false,
            };
          }
        ) || [];

      setCadastralDataPfID(
        propertyData.projectCadastralRecords.cadastralDataPfID
      );
      setAreaDataPfID(propertyData.projectCadastralRecords.totalAreaPfID);

      setMultipleData(ownersData);
    }
  }, [propertyData]);

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
    const urlPath = `public/campaign/${
      propertyData.propertyInfo.campaignID
    }-campaign/properties/${
      propertyData.propertyInfo.id
    }-property/other/archivos_postulante/certificados_tradicion/${formatFileName(
      fileToSave.name
    )}`;

    if (documentID) {
      const oldDocument = propertyData.projectFiles.find(
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
        graphqlOperation(updatePropertyFeature, {
          input: updatedProductFeature,
        })
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
      console.log(s3Client, "s3client 284");
      console.log(urlPath, "urlPath cadastral 284");
      console.log(fileToSave, "fileToSave cadastral 285");

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: urlPath,
        Body: fileToSave,
        ContentType: fileToSave.type,
      });

      try {
        const uploadImageResult = await s3Client.send(command);
        console.log(uploadImageResult, "uploadImageResult");
        /* const uploadImageResult = await Storage.put(urlPath, fileToSave, {
        }); */

        console.log("Archivo seleccionado:", fileToSave);
        console.log("Archivo subido:", uploadImageResult);
      } catch (error) {
        console.error(error);
        notify({
          msg: "Ups!, parece que algo ha fallado al intentar subir el archivo",
          type: "error",
        });
        return;
      }

      const newPropertyFeature = {
        featureID: "B_owner_certificado",
        propertyID: propertyData.propertyInfo.id,
        value: fileToSave.name,
      };
      console.log("newPropertyFeature:", newPropertyFeature);
      const createPropertyFeatureResponse = await API.graphql(
        graphqlOperation(createPropertyFeature, { input: newPropertyFeature })
      );

      const newDocument = {
        propertyFeatureID:
          createPropertyFeatureResponse.data.createPropertyFeature.id,
        userID: user.id,
        timeStamp: Date.now(),
        status: "pending",
        isApproved: false,
        isUploadedToBlockChain: false,
        url: WebAppConfig.url_s3_images + urlPath,
      };

      const createDocumentResponse = await API.graphql(
        graphqlOperation(createDocument, { input: newDocument })
      );

      docID = createDocumentResponse.data.createDocument.id;
    }
    return docID;
  };

  // Crear una función que actualice el area

  const handleSaveHistoricalData = async (indexToSave) => {
    if (!predialFetchedData[multipleData[indexToSave].cadastralNumber]) {
      notify({
        msg: "Ingresa un identificador catastral valido",
        type: "error",
      });
      return;
    }
    let error = false;
    const newCadastralNumber = multipleData[indexToSave].cadastralNumber;
    const certificate = multipleData[indexToSave].certificate;
    // const count = propertyData.propertyInfo.token.historicalData.reduce((acc, hd) => (hd.period === multipleData[indexToSave].period ? acc + 1 : acc), 0);
    const isAlreadyExistingCadastralNumber =
      propertyData.projectCadastralRecords.cadastralRecords.some(
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
        console.log(
          "certificate 371",

          certificate,
          documentID
        );
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

      if (areaDataPfID) {
        let tempPropertyFeature = {
          id: areaDataPfID,
          value: totalArea,
        };
        const response = await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: tempPropertyFeature,
          })
        );

        if (!response.data.updatePropertyFeature) error = true;
      } else {
        let tempPropertyFeature = {
          value: totalArea,
          isToBlockChain: false,
          isOnMainCard: false,
          propertyID: propertyData.propertyInfo.id,
          featureID: "D_area",
        };
        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: tempPropertyFeature,
          })
        );

        setAreaDataPfID(response.data.createPropertyFeature.id);

        if (!response.data.createPropertyFeature) error = true;
      }

      if (cadastralData) {
        let tempPropertyFeature = {
          id: cadastralData,
          value: JSON.stringify(getImportantValues(tempMultipleData)),
        };
        const response = await API.graphql(
          graphqlOperation(updatePropertyFeature, {
            input: tempPropertyFeature,
          })
        );

        if (!response.data.updatePropertyFeature) error = true;
      } else {
        let tempPropertyFeature = {
          value: JSON.stringify(getImportantValues(tempMultipleData)),
          isToBlockChain: false,
          isOnMainCard: false,
          propertyID: propertyData.propertyInfo.id,
          featureID: "A_predio_ficha_catastral",
        };

        const response = await API.graphql(
          graphqlOperation(createPropertyFeature, {
            input: tempPropertyFeature,
          })
        );

        setCadastralDataPfID(response.data.createPropertyFeature.id);

        if (!response.data.createPropertyFeature) error = true;
      }

      /* const updatedPropertyData = await fetchPropertyDataByPropertyID(
        propertyData.propertyInfo.id
      );

      const mappedDocument = updatedPropertyData.projectFiles.find(
        (item) => item.id === docID
      );

      const projectCadastralRecordsData =
        updatedPropertyData.projectCadastralRecords; */

      refresh();
    } else {
      notify({
        msg: "Completa todos los campos antes de guardar",
        type: "error",
      });
      return;
    }

    if (!error) {
      notify({
        msg: "Propietarios guardados exitosamente",
        type: "success",
      });
    }
  };

  const handleDeleteHistoricalData = async (indexToDelete) => {
    let error = false;

    const documentToDelete = propertyData.projectFiles.find(
      (item) => item.id === multipleData[indexToDelete].documentID
    );
    console.log("documentToDelete", documentToDelete);
    if (documentToDelete) {
      // Borrar de S3
      const getFilePathRegex = /\/projects\/(.+)$/;

      const fileToDeleteName = decodeURIComponent(
        documentToDelete.url.match(getFilePathRegex)[1]
      );
      console.log(fileToDeleteName, "filetodelete");
      /* try {
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
      } */
    }

    // Actualizar multipleData
    const tempMultipleData = multipleData.filter(
      (_, index) => index !== indexToDelete
    );
    setMultipleData(tempMultipleData);

    if (
      areaDataPfID &&
      predialFetchedData[multipleData[indexToDelete].cadastralNumber]
        ?.AREA_TERRENO
    ) {
      let tempPropertyFeature = {
        id: areaDataPfID,
        value:
          totalArea -
          predialFetchedData[multipleData[indexToDelete].cadastralNumber]
            ?.AREA_TERRENO,
      };
      const response = await API.graphql(
        graphqlOperation(updatePropertyFeature, { input: tempPropertyFeature })
      );

      if (!response.data.updatePropertyFeature) error = true;
    }

    if (cadastralData) {
      let tempPropertyFeature = {
        id: cadastralData,
        value: JSON.stringify(getImportantValues(tempMultipleData)),
      };
      const response = await API.graphql(
        graphqlOperation(updatePropertyFeature, { input: tempPropertyFeature })
      );

      if (!response.data.updatePropertyFeature) error = true;
    } else {
      let tempPropertyFeature = {
        value: JSON.stringify(getImportantValues(tempMultipleData)),
        isToBlockChain: false,
        isOnMainCard: false,
        propertyID: propertyData.propertyInfo.id,
        featureID: "A_predio_ficha_catastral",
      };
      const response = await API.graphql(
        graphqlOperation(createPropertyFeature, { input: tempPropertyFeature })
      );
      setCadastralDataPfID(response.data.createPropertyFeature.id);

      if (!response.data.createPropertyFeature) error = true;
    }

    /* const updatedPropertyData = await fetchPropertyDataByPropertyID(
      propertyData.propertyInfo.id
    );

    const projectCadastralRecordsData =
      updatedPropertyData.projectCadastralRecords; */

    refresh();

    if (!error) {
      notify({
        msg: "Valores borrados exitosamente",
        type: "success",
      });
    }
  };

  const renderFileLinkByDocumentID = (documentID) => {
    if (documentID) {
      const document = propertyData.projectFiles.find(
        (item) => item.id === documentID
      );
      return (
        <button
          onClick={() => handleOpenObject(s3Client, bucketName, document?.url)}
        >
          Archivo
        </button>
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
          <table>
            <thead className="text-center">
              <tr>
                <th style={{ width: "240px" }}>Identificador catastral</th>
                <th style={{ width: "180px" }}>Certificado de tradición</th>
                <th style={{ width: "180px" }}>Nombre de predio</th>
                <th style={{ width: "180px" }}>Área</th>
                <th style={{ width: "120px" }}></th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {multipleData.map((data, index) => {
                return (
                  <tr
                    key={index}
                    className="text-center border-b-2"
                    style={{ height: "3rem" }}
                  >
                    {data.editing ? (
                      <>
                        <td>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={data.cadastralNumber}
                              className="text-center p-2 border rounded-md w-full"
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
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, index)}
                          />
                          <button
                            className="p-2 text-white rounded-md bg-blue-500"
                            onClick={handleUploadButton}
                          >
                            {data.certificate || data.documentID !== undefined
                              ? "Actualizar"
                              : "Cargar"}
                          </button>
                        </td>
                        <td>
                          {renderPredioNameByCadastralNumber(
                            data.cadastralNumber
                          )}
                        </td>
                        <td>
                          {renderAreaByCadastralNumber(data.cadastralNumber)}
                        </td>
                        <td className="flex justify-end gap-1">
                          <button
                            className="p-2 text-white rounded-md bg-green-700"
                            onClick={() => handleSaveHistoricalData(index)}
                          >
                            <SaveDiskIcon />
                          </button>
                          <button
                            className="p-2 text-white rounded-md bg-red-500"
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="text-break">
                          {(user.role === "admon" ||
                            user.role === "validator" ||
                            user.id === propertyData.projectPostulant.id ||
                            user.id === propertyData.propertyCampaign.userId) ?
                            data.cadastralNumber?.toUpperCase() : '********************'}
                        </td>
                        <td>{renderFileLinkByDocumentID(data.documentID)}</td>
                        <td className="text-break">
                          {renderPredioNameByCadastralNumber(
                            data.cadastralNumber
                          )}
                        </td>
                        <td>
                          {renderAreaByCadastralNumber(data.cadastralNumber)}
                        </td>
                        <td className="flex justify-end gap-1">
                          <button
                            className="p-2 text-white rounded-md bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!autorizedUser}
                            onClick={() => handleEditHistoricalData(index)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="p-2 text-white rounded-md bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!autorizedUser}
                            onClick={() => handleDeleteHistoricalData(index)}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              <tr>
                <td colSpan={6}>
                  <div className="flex">
                    <button
                      className="p-2 w-full text-white rounded-md bg-slate-600 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!autorizedUser}
                      onClick={() => handleAddNewPeriodToHistoricalData()}
                    >
                      <PlusIcon></PlusIcon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );
}
