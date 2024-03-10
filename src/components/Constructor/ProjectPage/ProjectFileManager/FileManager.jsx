import React, { useEffect, useState } from "react";

import Card from "components/common/Card";
import Breadcrumb from "../../../ui/Breadcrumb";
import DropdownButton from "../../../ui/DropdownButton";
import Dropdown from "../../../ui/Dropdown";
import Form  from "../../../ui/Form";
import Table  from "../../../ui/Table";
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
  const { className, rootFolder } = props;

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
        if(currentPath.length === 0) {
          setSelectedFolder(data[rootFolder].data);
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
    if (index !== -1) {
      const goBackArray = currentPath.slice(0, index + 1);
      let tempState = s3Objects[rootFolder].data;
      let aux = null;
      for (let i = 0; i < goBackArray.length; i++) {
        aux = handleClick(tempState, goBackArray[i]);
        tempState = aux;
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
  }

  const getVisibleStatus = (key) => {
    const file =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (file) => file.filePathS3 === key
      )[0];
    if (file) {
      if (file.visible) {
        return (
          <Form.Check
            checked={true}
            onChange={() => handleUpdateVisibleStatus(file.id, false)}
          ></Form.Check>
        );
      } else {
        return (
          <Form.Check
            checked={false}
            onChange={() => handleUpdateVisibleStatus(file.id, true)}
          ></Form.Check>
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

  console.log(s3Objects, "s3Objects");
  console.log(Object.keys(selectedFolder), "selectedFolder");
  console.log(selectedFolder, "selectedFolder");
  console.log(currentPath, "currentPath");
  //console.log(Object.keys(s3Objects[Object.keys(selectedFolder)[0]].data), "Este es")
  return (
    <div className={className}>
    <div className="p-6 border-b border-gray-300">
      <h2 className="text-xl font-semibold mb-4">Gestión de Archivos</h2>
      <div className="flex justify-between">
        <Breadcrumb className="border pt-3 px-3">
          {currentPath.map((path, index) => (
            <Breadcrumb.Item
              href="#"
              key={path}
              onClick={() => backToAnyFolder(path)}
              active={path === currentPath[currentPath.length - 1]}
            >
              {index === 0 ? "Inicio" : path}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <div className="flex gap-2">
          <NewFolderOnS3Modal uploadRoute={currentPath.join("/")} />
          <UploadFileModal uploadRoute={currentPath.join("/")} />
        </div>
      </div>
    </div>
    <div className="p-6">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-3/12">Nombre</th>
            <th className="text-center">Tamaño</th>
            <th className="text-center">Ultima modificación</th>
            <th className="text-center">Subido por</th>
            <th className="text-center">Visible</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {currentPath.length > 1 && (
            <tr>
              <td
                onClick={() =>
                  backToAnyFolder(currentPath[currentPath.length - 2])
                }
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  <FolderIcon />
                  <span className="text-base ms-2">...</span>
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
                <tr key={index}>
                  <td
                    onClick={() => handleClickSelect(folder)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      {selectedFolder[folder].type === "folder" ? (
                        <FolderIcon />
                      ) : (
                        <></>
                      )}
                      <span className="text-base ms-2">{folder}</span>
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
                  <td className="text-center">{getUploadedByName(selectedFolder[folder].key)}</td>
                  <td className="text-center">
                    {selectedFolder[folder].type === "file" && (
                      <div className="flex justify-center">
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
                      {selectedFolder[folder].type === "file" && (
                        <>
                        <Dropdown.Item
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
    </div>
  </div>
    );
}
