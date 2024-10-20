import React, { useEffect, useState } from "react";

import Card from "components/common/Card";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { FolderIcon } from "components/common/icons/FolderIcon";
import { AddFolderIcon } from "components/common/icons/AddFolderIcon";
import { convertAWSDatetimeToDate } from "../utils";
import { API, Storage, graphqlOperation } from "aws-amplify";
import UploadFileModal from "components/Modals/UploadFileModal";
import { deleteDocument, updateProductFeature } from "graphql/mutations";
import { useProjectData } from "context/ProjectDataContext";
import { moveToBackupFolderS3, removeFolderS3 } from "utilities/moveToBackupS3";
import NewFolderOnS3Modal from "components/Modals/NewFolderOnS3Modal";

export default function FileManager(props) {
  const { className, rootFolder, isAnalyst } = props;

  const [s3Objects, setS3Objects] = useState({});
  const [selectedFolder, setSelectedFolder] = useState({});
  const [currentPath, setCurrentPath] = useState([]);

  const { projectData, handleUpdateContextProjectFileValidators } =
    useProjectData();

  useEffect(() => {
    listObjectsInFolder(rootFolder)
      .then((data) => {
        // const actualFolder = currentPath.length === 0 ? rootFolder : currentPath.join("/");
        setS3Objects(data);
        if (currentPath.length === 0) {
          console.log(data[rootFolder].data, 'data[rootFolder].data')
          console.log([rootFolder], '[rootFolder]')
          console.log(data, 'data 32')
          console.log(isAnalyst, 'isAnalyst')
          setSelectedFolder(isAnalyst? {Analista: data[rootFolder].data["Analista"]}: data[rootFolder].data);
          setCurrentPath([rootFolder]);
        } else {
          let currentData = data;

          // Itera a través de currentPath para navegar por la estructura de datos
          for (const pathSegment of currentPath) {
            currentData = currentData[pathSegment].data;
          }
          setSelectedFolder(currentData);
          setCurrentPath([...currentPath]);
        }
      })
      .catch((error) => {
        console.error("Error al listar objetos:", error);
      });
  }, [projectData]);

  async function listObjectsInFolder(folder) {
    try {
      const objects = await Storage.list(folder, { pageSize: 1000 });
      let nestedStorage = processStorageList(objects);
      return nestedStorage;
    } catch (error) {
      console.error("Error al listar objetos:", error);
      throw error;
    }
  }

  function processStorageList(response) {
    const filesystem = {};
    const add = (source, target, item) => {
      const elements = source.split("/");
      const element = elements.shift();
      if (!element) return;
      if (elements.length === 0) {
        target[element] = { type: "file", ...item };
      } else {
        target[element] = target[element] || { type: "folder", data: {} };
        add(elements.join("/"), target[element].data, item);
      }
    };
    response.results.forEach((item) => add(item.key, filesystem, item));
    return filesystem;
  }

  const handleClick = (object, propertyName) => {
    if (propertyName === rootFolder) {
      return s3Objects[rootFolder].data;
    }
    const selectedItem = object[propertyName];
    console.log(selectedItem, "selectedItem");
    console.log(object, "object");
    console.log(propertyName, "propertyName");
    if (selectedItem.type === "folder") {
      return object[propertyName].data;
    } else if (selectedItem.type === "file") {
      console.log(`Archivo ${propertyName}:`, selectedItem);
    }
  };

  const handleClickSelect = (propertyName) => {
    const selectedItem = selectedFolder[propertyName];
    if (selectedItem.type === "folder") {
      setSelectedFolder(selectedFolder[propertyName].data);
      setCurrentPath([...currentPath, propertyName]);
    } else if (selectedItem.type === "file") {
      handleDownload(selectedItem.key);
      console.log(`Archivo ${propertyName}:`, selectedItem);
    }
  };

  const backToFolder = () => {
    const goBackArray = currentPath.slice(0, -1);
    let tempState = s3Objects;
    let aux = null;
    for (let i = 0; i < goBackArray.length; i++) {
      aux = handleClick(tempState, goBackArray[i]);
      tempState = aux;
    }

    setCurrentPath(goBackArray);
    setSelectedFolder(tempState);
  };

  const backToAnyFolder = (path) => {
    const pathToBack = path;
    console.log(pathToBack, "pathToBack");

    const index = currentPath.indexOf(pathToBack);

    console.log(index, 'currentPath.indexOf(pathToBack)')
    console.log(currentPath, 'currentPath')
    if (index !== -1) {
      const goBackArray = currentPath.slice(0, index + 1);
      let tempState = s3Objects[rootFolder].data;
      let aux = null;
      for (let i = 0; i < goBackArray.length; i++) {
        aux = handleClick(tempState, goBackArray[i]);
        tempState = aux;
      }

      console.log(goBackArray)
      console.log(tempState)
      if(index === 0 && isAnalyst){
        tempState = {Analista: tempState.Analista}
      }
      setCurrentPath(goBackArray);
      setSelectedFolder(tempState);
    }
  };
  const handleDownload = async (doc) => {
    try {
      const id = doc;
      const response = await Storage.get(id, { download: true });

      // Extraer el nombre del archivo de la ruta de S3
      const fileName = id.split("/").pop();

      const url = URL.createObjectURL(response.Body);
      const link = document.createElement("a");
      link.href = url;

      // Usar el nombre del archivo para el atributo 'download'
      link.download = fileName;

      link.click();
    } catch (error) {
      console.log("Error al descargar el archivo:", error);
    }
  };

  const handleDeleteFolder = async (folder) => {
    const folderToDelete = currentPath.join("/") + "/" + folder;
    console.log(folderToDelete);
    const updatedDocsData =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file, index) => !file.filePathS3.includes(folderToDelete)
      );

    const filesToDelete =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file, index) => file.filePathS3.includes(folderToDelete)
      );
    for (let i = 0; i < filesToDelete.length; i++) {
      await moveToBackupFolderS3(filesToDelete[i].filePathS3);

      const fileToDeleteID = filesToDelete[i].id;

      let docToDelete = {
        id: fileToDeleteID,
      };
      await API.graphql(
        graphqlOperation(deleteDocument, { input: docToDelete })
      );
    }

    let tempProductFeature = {
      id: projectData.projectFilesValidators.pfProjectValidatorDocumentsID,
      value: JSON.stringify(updatedDocsData),
    };
    await API.graphql(
      graphqlOperation(updateProductFeature, { input: tempProductFeature })
    );

    await removeFolderS3(folderToDelete);

    await handleUpdateContextProjectFileValidators({
      projectValidatorDocuments: updatedDocsData,
    });
  };

  const handleDeleteFile = async (key) => {
    await moveToBackupFolderS3(key);

    const updatedDocsData =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file, index) => file.filePathS3 !== key
      );
    await handleUpdateContextProjectFileValidators({
      projectValidatorDocuments: updatedDocsData,
    });

    const fileToDeleteID =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file) => file.filePathS3 === key
      )[0].id;

    let docToDelete = {
      id: fileToDeleteID,
    };
    await API.graphql(graphqlOperation(deleteDocument, { input: docToDelete }));

    let tempProductFeature = {
      id: projectData.projectFilesValidators.pfProjectValidatorDocumentsID,
      value: JSON.stringify(updatedDocsData),
    };
    await API.graphql(
      graphqlOperation(updateProductFeature, { input: tempProductFeature })
    );
  };

  // function to convert bytes into friendly format
  const bytesToSize = (bytes) => {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const getUploadedByName = (key) => {
    const file =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file) => file.filePathS3 === key
      )[0];
    if (file) {
      return file.uploadedBy;
    } else {
      return "-";
    }
  };

  const getVisibleStatus = (key) => {
    const file =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file) => file.filePathS3 === key
      )[0];
    if (file) {
      if (file.visible) {
        return (
          <input
            type="checkbox"
            checked={true}
            onChange={() => handleUpdateVisibleStatus(file.id, false)}
          />
        );
      } else {
        return (
          <input
            type="checkbox"
            checked={false}
            onChange={() => handleUpdateVisibleStatus(file.id, true)}
          />
        );
      }
    } else {
      return "";
    }
  };

  const handleUpdateVisibleStatus = async (id, status) => {
    const updatedDocsData =
      projectData.projectFilesValidators.projectValidatorDocuments.map(
        (file, index) => {
          if (file.id === id) {
            file.visible = status;
          }
          return file;
        }
      );
    await handleUpdateContextProjectFileValidators({
      projectValidatorDocuments: updatedDocsData,
    });

    let tempProductFeature = {
      id: projectData.projectFilesValidators.pfProjectValidatorDocumentsID,
      value: JSON.stringify(updatedDocsData),
    };
    await API.graphql(
      graphqlOperation(updateProductFeature, { input: tempProductFeature })
    );
  };

  /* console.log(s3Objects, "s3Objects");
  console.log(Object.keys(selectedFolder), "selectedFolder");
  console.log(selectedFolder, "selectedFolder");
  console.log(currentPath, "currentPath"); */
  //console.log(Object.keys(s3Objects[Object.keys(selectedFolder)[0]].data), "Este es")
  return (
    <Card className={className}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <nav
            className="flex  flex-start text-gray-700 py-3"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {currentPath.map((path, index) => (
                <li>
                  <div
                    className="flex items-center"
                    href="#"
                    key={index}
                    onClick={() => backToAnyFolder(path)}
                  >
                    {index !== 0 && (
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    )}
                    <a className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium">
                      {index === 0 ? "Inicio" : path}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
          <div className="d-flex gap-2">
            <NewFolderOnS3Modal uploadRoute={currentPath.join("/")} />
            <UploadFileModal uploadRoute={currentPath.join("/")} />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th style={{ width: "600px" }}>Nombre</th>
              <th className="text-center">Tamaño</th>
              <th className="text-center" style={{ width: "100px" }}>
                Ultima modificación
              </th>
              <th className="text-center" style={{ width: "100px" }}>
                Subido por
              </th>
              <th className="text-center">Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {/* {Object.keys(selectedFolder).length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay archivos en esta carpeta
                </td>
              </tr>
            )} */}
            {currentPath.length > 1 && (
              <tr className="border-t-[1px] w-full" style={{ height: "3rem" }}>
                <td
                  onClick={() =>
                    backToAnyFolder(currentPath[currentPath.length - 2])
                  }
                >
                  <div className="flex items-end">
                    <FolderIcon />
                    <span className="text-lg w-fit pl-2">...</span>
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
            {Object.keys(selectedFolder)
              .filter((sf) => sf !== "backup")
              .map((folder, index) => {
                return (
                  <tr
                    key={index}
                    className="border-t-[1px]"
                    style={{ height: "3rem" }}
                  >
                    <td
                      onClick={() => handleClickSelect(folder)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="flex items-end">
                        {selectedFolder[folder].type === "folder" ? (
                          <FolderIcon />
                        ) : (
                          <></>
                        )}

                        <span className="text-lg w-fit pl-2">{folder}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      {selectedFolder[folder].size
                        ? bytesToSize(selectedFolder[folder].size)
                        : ""}
                    </td>
                    <td className="text-center">
                      {selectedFolder[folder].lastModified
                        ? convertAWSDatetimeToDate(
                            selectedFolder[folder].lastModified
                          )
                        : ""}
                    </td>
                    <td className="text-center">
                      {getUploadedByName(selectedFolder[folder].key)}
                    </td>
                    <td className="text-center">
                      {selectedFolder[folder].type === "file" && (
                        <div className="d-flex justify-content-center">
                          {getVisibleStatus(selectedFolder[folder].key)}
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      <DropdownButton
                        align="end"
                        title="Acciones"
                        drop="end"
                        size="sm"
                      >
                        {/* <Dropdown.Item eventKey="1">Mover</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Cambiar nombre</Dropdown.Item> */}
                        {selectedFolder[folder].type === "file" && (
                          <>
                            <Dropdown.Item
                              eventKey="3"
                              onClick={() =>
                                handleDownload(selectedFolder[folder].key)
                              }
                            >
                              Descargar
                            </Dropdown.Item>
                            <Dropdown.Divider />
                          </>
                        )}
                        <Dropdown.Item
                          eventKey="4"
                          onClick={() => {
                            if (selectedFolder[folder].type === "file") {
                              handleDeleteFile(selectedFolder[folder].key);
                            }
                            if (selectedFolder[folder].type === "folder") {
                              handleDeleteFolder(folder);
                            }
                          }}
                        >
                          Eliminar
                        </Dropdown.Item>
                      </DropdownButton>
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
