import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
import { FolderIcon } from "components/common/icons/FolderIcon";
import { convertAWSDatetimeToDate } from "components/Constructor/ProjectPage/utils";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { AddFolderIcon } from "components/common/icons/AddFolderIcon";

const S3FileManager = ({ userId }) => {
  const [currentPath, setCurrentPath] = useState(""); // Ruta actual en la navegación
  const [items, setItems] = useState([]); // Archivos y carpetas en el nivel actual
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [totalProgress, setTotalProgress] = useState(0); // Progreso total

  useEffect(() => {
    if (userId) listItems(); // Carga inicial de archivos
  }, [userId, currentPath]);

  const listItems = async () => {
    try {
      const prefix = `analyst/${userId}/${currentPath}`;
      const fileKeys = await Storage.list(prefix);

      const folders = new Set();
      const files = [];
      fileKeys.results.forEach((item) => {
        const relativePath = item.key.replace(`analyst/${userId}/`, "");
        const parts = relativePath.replace(currentPath, "").split("/");

        if (parts.length > 1) {
          // Es una carpeta si tiene más de un nivel en su estructura
          folders.add(parts[0]); // Añadir el nombre de la carpeta al conjunto
        } else if (parts.length === 1) {
          // Es un archivo si está en el nivel actual y no tiene subniveles
          files.push({
            name: parts[0],
            size: item.size,
            lastModified: item.lastModified,
          });
        }
      });
      console.log("fileKeys.results", fileKeys.results);

      console.log("folders", folders);
      console.log("files", files);

      setItems([
        ...Array.from(folders).map((folder) => ({
          name: folder,
          isFolder: true,
        })),
        ...files,
      ]);
    } catch (error) {
      console.error("Error al listar archivos y carpetas:", error);
    }
  };

  const navigateToFolder = (folderName) => {
    setCurrentPath((prev) => `${prev}${folderName}/`);
  };

  const goBack = () => {
    setCurrentPath((prev) => {
      const parts = prev.split("/").filter((part) => part); // Elimina espacios vacíos
      parts.pop();
      return parts.length ? parts.join("/") + "/" : "";
    });
  };

  const handleFileUpload = async (event) => {
    const filesToUpload = Array.from(event.target.files);
    if (filesToUpload.length > 0) {
      setUploadingFiles(filesToUpload); // Actualiza la lista de archivos que se están subiendo
      setProgress({}); // Reinicia los progresos previos
      setTotalProgress(0); // Reinicia el progreso total
      await uploadFiles(filesToUpload); // Llama al proceso de carga
    }
  };

  const handleFolderUpload = async (event) => {
    const filesToUpload = Array.from(event.target.files);
    await uploadFiles(filesToUpload, true);
  };

  const uploadFiles = async (filesToUpload) => {
    let totalLoaded = 0;
    let totalFiles = filesToUpload.length;
  
    for (const file of filesToUpload) {
      const relativePath = file.name; // Puede personalizarse para manejar rutas de carpetas
  
      try {
        await Storage.put(`analyst/${userId}/${currentPath}${relativePath}`, file, {
          progressCallback(progressData) {
            const fileProgress = Math.round(
              (progressData.loaded / progressData.total) * 100
            );
            setProgress((prev) => ({
              ...prev,
              [file.name]: fileProgress,
            }));
  
            // Calcular el progreso total basado en la carga de cada archivo
            totalLoaded++;
            const newTotalProgress = Math.round(
              (totalLoaded / totalFiles) * 100
            );
            setTotalProgress(newTotalProgress);
          },
        });
  
        // Después de completar un archivo, asegurarse de que se marca como 100%
        setProgress((prev) => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error("Error al cargar archivo:", error);
      }
    }
  
    // Reiniciar estado después de la carga de todos los archivos
    setUploadingFiles([]); // Vaciar lista de archivos subiendo
    setTotalProgress(0); // Reiniciar el progreso total
    listItems(); // Recargar la lista de archivos
  };

  const deleteItem = async (item) => {
    const key = `analyst/${userId}/${currentPath}${item.name}`;
    try {
      await Storage.remove(key);
      listItems();
    } catch (error) {
      console.error("Error al eliminar archivo o carpeta:", error);
    }
  };

  const bytesToSize = (bytes) => {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  if (!userId) {
    return null;
  }

  console.log("items", items);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Gestor de Archivos S3
      </h1>

      {/* Barra de progreso */}
      {totalProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-300 h-2">
            <div
              className="bg-blue-600 h-2"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-center text-gray-600">{totalProgress}% Cargado</p>
        </div>
      )}

      <div className="flex justify-content-between mb-2">
        <p className="text-sm text-gray-600">
          Ruta actual: {currentPath || "/"}
        </p>
        <div className="flex gap-2">
          <label className="p-2 text-white bg-blue-600 rounded-md">
            <AddFolderIcon />
            <input
              type="file"
              multiple
              webkitdirectory="true"
              onChange={handleFolderUpload}
              className="hidden"
            />
          </label>
          <label className="p-2 text-white bg-blue-600 rounded-md">
            Subir Archivos
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th style={{ width: "600px" }}>Nombre</th>
            <th className="text-center" style={{ width: "150px" }}>
              Tamaño
            </th>
            <th className="text-center" style={{ width: "300px" }}>
              Ultima modificación
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {currentPath.length > 1 && (
            <tr className="border-t-[1px] w-full" style={{ height: "3rem" }}>
              <td onClick={() => goBack()}>
                <div className="flex items-end">
                  <FolderIcon />
                  <span className="text-lg w-fit pl-2">...</span>
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )}
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-t-[1px]"
              style={{ height: "3rem" }}
            >
              <td
                onClick={() =>
                  item.isFolder ? navigateToFolder(item.name) : null
                }
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-end">
                  {item.isFolder ? <FolderIcon /> : <></>}

                  <span className="text-lg w-fit pl-2">{item.name}</span>
                </div>
              </td>
              <td className="text-center">
                {item.size ? bytesToSize(item.size) : ""}
              </td>
              <td className="text-center">
                {item.lastModified
                  ? new Date(item.lastModified).toLocaleString()
                  : ""}
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
                  {!item.isFolder && (
                    <>
                      <Dropdown.Item
                        eventKey="3"
                        /* onClick={() => handleDownload(selectedFolder)} */
                      >
                        Descargar
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )}
                  <Dropdown.Item eventKey="4" onClick={() => deleteItem(item)}>
                    Eliminar
                  </Dropdown.Item>
                </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default S3FileManager;
