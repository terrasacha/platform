import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useProjectData } from "context/ProjectDataContext";
import { API, Storage, graphqlOperation } from "aws-amplify";
import {
  createDocument,
  createProductFeature,
  updateProductFeature,
} from "graphql/mutations";
import { useAuth } from "context/AuthContext";
import { Spinner } from "react-bootstrap";
import WebAppConfig from "components/common/_conf/WebAppConfig";

export default function UploadFileModal(props) {
  const { uploadRoute } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  const { projectData, handleUpdateContextProjectFileValidators } =
    useProjectData();
  const { user } = useAuth();

  const openModal = () => {
    console.log(uploadRoute);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setSelectedFiles([]);
    setFileNames([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const names = files.map((file) => "");
    setFileNames(names);
  };

  const handleSetFileName = (e, index) => {
    const updatedFileNames = [...fileNames];
    updatedFileNames[index] = e.target.value;
    setFileNames(updatedFileNames);
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const formatFileName = (fileName) => {
    const formattedFilename = fileName
      .toLowerCase()
      .trim()
      .replaceAll(" ", "_");
    const filenameWithoutAccents = removeAccents(formattedFilename);
    return encodeURIComponent(filenameWithoutAccents);
  };

  const uploadFilesToS3 = async (files) => {
    let urls = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      try {
        const urlPath = `${uploadRoute}/${formatFileName(file.name)}`;
        const uploadFileResult = await Storage.put(urlPath, file, {
          level: "public",
          contentType: "*/*",
        });
        urls.push(urlPath);

        console.log("urlPath", urlPath);
        console.log("file", file);
        console.log("uploadFileResult", uploadFileResult);
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        throw new Error("Error al subir el archivo");
      }
    }
    return urls;
  };

  const createDocumentsFromFileURL = async (urls, userID, pfID) => {
    const results = await Promise.all(
      urls.map(async (filePath, index) => {
        const awsUrlFullPath =
          WebAppConfig.url_s3_public_images + encodeURIComponent(filePath);

        const segments = filePath.split("/");
        const fileName = segments.pop();
        console.log(awsUrlFullPath, "awsUrlFullPath")
        const tempNewDocument = {
          isApproved: true,
          isUploadedToBlockChain: false,
          status: "validatorFile",
          timeStamp: Date.now(),
          url: awsUrlFullPath,
          userID: userID,
          productFeatureID: pfID,
        };

        const createDocumentResult = await API.graphql(
          graphqlOperation(createDocument, { input: tempNewDocument })
        );

        return {
          id: createDocumentResult.data.createDocument.id,
          docTitle: fileName,
          fileURLS3: awsUrlFullPath,
          filePathS3: filePath,
          createdAt: Date.now(),
          uploadedBy: user.name,
          visible: false,
        };
      })
    );

    return results;
  };

  const handleSaveChanges = async () => {
    setIsLoadingDoc(true);

    let pfProjectValidatorDocumentsID;

    if (!projectData.projectFilesValidators.pfProjectValidatorDocumentsID) {
      let tempProductFeature = {
        value: "",
        isToBlockChain: false,
        isOnMainCard: false,
        productID: projectData.projectInfo.id,
        featureID: "GLOBAL_PROJECT_VALIDATOR_FILES",
      };
      const createProductFeatureResponse = await API.graphql(
        graphqlOperation(createProductFeature, { input: tempProductFeature })
      );

      pfProjectValidatorDocumentsID =
        createProductFeatureResponse.data.createProductFeature.id;
    } else {
      pfProjectValidatorDocumentsID =
        projectData.projectFilesValidators.pfProjectValidatorDocumentsID;
    }

    const filesS3URL = await uploadFilesToS3(selectedFiles);
    const docData = await createDocumentsFromFileURL(
      filesS3URL,
      user.id,
      pfProjectValidatorDocumentsID
    );
    console.log(docData);
    const updatedDocsData = [
      ...projectData.projectFilesValidators.projectValidatorDocuments,
      ...docData,
    ];

    await handleUpdateContextProjectFileValidators({
      projectValidatorDocuments: updatedDocsData,
    });

    let tempProductFeature = {
      id: pfProjectValidatorDocumentsID,
      value: JSON.stringify(updatedDocsData),
    };
    await API.graphql(
      graphqlOperation(updateProductFeature, { input: tempProductFeature })
    );

    setIsLoadingDoc(false);
    closeModal();
  };

  return (
    <div>
      <button
        className="p-2 text-white bg-blue-600 rounded-md"
        onClick={openModal}
      >
        Subir archivo
      </button>

      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva documentación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border w-full"
          />
          {selectedFiles.length > 0 && (
            <div className="border">
              <div className="row row-cols-1 p-3 g-2">
                {selectedFiles.map((file, index) => (
                  <div key={index}>
                    <p controlId={`file${index}`}>
                      Archivo #{index + 1}: {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            className="p-2 text-white bg-slate-600 rounded-md"
            onClick={closeModal}
          >
            Cerrar
          </button>
          <button
            className="p-2 text-white bg-blue-600 rounded-md"
            onClick={() => handleSaveChanges()}
          >
            {isLoadingDoc ? (
              <Spinner size="sm" className="p-2"></Spinner>
            ) : (
              "Cargar"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
