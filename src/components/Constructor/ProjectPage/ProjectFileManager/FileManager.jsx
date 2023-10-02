import React, { useEffect, useState } from "react";

import Card from "components/common/Card";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, Form, Table } from "react-bootstrap";
import { FolderIcon } from "components/common/icons/FolderIcon";
import { AddFolderIcon } from "components/common/icons/AddFolderIcon";
import { convertAWSDatetimeToDate } from "../utils";
import { Storage } from "aws-amplify";

export default function FileManager(props) {
  const { className, rootFolder } = props;

  const [s3Objects, setS3Objects] = useState({});
  const [selectedFolder, setSelectedFolder] = useState({});
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    listObjectsInFolder(rootFolder)
      .then((data) => {
        setS3Objects(data);
        setSelectedFolder(data[rootFolder].data);
        setCurrentPath([rootFolder]);
      })
      .catch((error) => {
        console.error("Error al listar objetos:", error);
      });
  }, []);

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
      let id = doc;
      const response = await Storage.get(id, { download: true });
      const url = URL.createObjectURL(response.Body);
      const link = document.createElement("a");
      link.href = url;
      link.download = id;
      link.click();
    } catch (error) {
      console.log("Error al descargar el archivo:", error);
    }
  };

  console.log(s3Objects, "s3Objects");
  console.log(Object.keys(selectedFolder), "selectedFolder");
  console.log(selectedFolder, "selectedFolder");
  console.log(currentPath, "currentPath");
  //console.log(Object.keys(s3Objects[Object.keys(selectedFolder)[0]].data), "Este es")
  return (
    <Card className={className}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <Breadcrumb>
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
          <div className="d-flex gap-2">
            <Button variant="primary" size="md">
              <AddFolderIcon />
            </Button>
            <Button variant="primary " size="md">
              Subir archivo
            </Button>
          </div>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th style={{ width: "600px" }}>Nombre</th>
              <th className="text-center">Tamaño</th>
              <th className="text-center" style={{ width: "100px" }}>
                Ultima modificación
              </th>
              <th className="text-center">Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="align-middle">
            {Object.keys(selectedFolder).length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay archivos en esta carpeta
                </td>
              </tr>
            )}
            {currentPath.length > 1 && (
              <tr>
                <td onClick={() => backToAnyFolder(currentPath[currentPath.length - 2])}>
                  <div>
                    <FolderIcon />
                    <span className="fs-6 ms-2">...</span>
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
            {Object.keys(selectedFolder).map((folder, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div>
                      {selectedFolder[folder].type === "folder" ? (
                        <FolderIcon />
                      ) : (
                        <></>
                      )}

                      <span
                        className="fs-6 ms-2"
                        onClick={() => handleClickSelect(folder)}
                        style={{ cursor: "pointer" }}
                      >
                        {folder}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">{selectedFolder[folder].size}</td>
                  <td className="text-center">
                    {selectedFolder[folder].lastModified
                      ? convertAWSDatetimeToDate(
                          selectedFolder[folder].lastModified
                        )
                      : ""}
                  </td>
                  <td className="text-center">
                    {selectedFolder[folder].type === "file" && (
                      <div className="d-flex justify-content-center">
                        <Form.Check></Form.Check>
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
                      <Dropdown.Item eventKey="1">Mover</Dropdown.Item>
                      <Dropdown.Item eventKey="2">Cambiar nombre</Dropdown.Item>
                      <Dropdown.Item eventKey="1">Descargar</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item eventKey="4">Eliminar</Dropdown.Item>
                    </DropdownButton>
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
