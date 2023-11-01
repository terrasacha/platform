import AdmZip from 'adm-zip';
import { API, graphqlOperation } from "aws-amplify";
import WebAppConfig from "components/common/_conf/WebAppConfig";
import { useAuth } from "context/AuthContext";
import { useProjectData } from "context/ProjectDataContext";
import { createDocument, createProductFeature, updateProductFeature } from "graphql/mutations";
import React, { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { notify } from "utilities/notify";

export default function UploadZipButton(props) {
  const { actualRoute } = props;

  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const fileInputRef = useRef(null);

  const { projectData, handleUpdateContextProjectFileValidators } =
    useProjectData();
  const { user } = useAuth();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const createDocumentsFromFileURL = async (urls, userID, pfID) => {
    const results = await Promise.all(
      urls.map(async (filePath, index) => {
        const awsUrlFullPath = WebAppConfig.url_s3_public_images + encodeURIComponent(filePath);

        const segments = filePath.split('/');
        const fileName = segments.pop();

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

  const handleFileChange = async (e) => {
    setIsLoadingDoc(true);
    const selectedFile = e.target.files[0];

    // Verifica si el archivo seleccionado tiene la extensión .zip
    if (selectedFile && !selectedFile.name.endsWith(".zip")) {
      // Muestra un mensaje de error si el archivo no es ZIP
      notify({ msg: "Selecciona un archivo ZIP válido.", type: "error" });
      setIsLoadingDoc(false);
      return;
    }

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
    const zipFile = selectedFile;
    const zip = new AdmZip(zipFile);

    // adm zip
    const zipEntries = zip.getEntries();

    const uploadedFileURLs = [];

    for (const zipEntry of zipEntries) {
      if (!zipEntry.isDirectory) {
        const zipEntryData = zipEntry.getData();
        const urlPath = `${actualRoute}/${formatFileName(zipEntry.entryName)}`;

        try {
          const uploadFileResult = await Storage.put(urlPath, zipEntryData, {
            level: "public",
            contentType: "*/*",
          });

          uploadedFileURLs.push(urlPath);
          console.log("uploadFileResult", uploadFileResult);
        } catch (error) {
          console.error("Error al subir el archivo:", error);
          throw new Error("Error al subir el archivo");
        }
      }
    }


    const docData = await createDocumentsFromFileURL(
      uploadedFileURLs,
      user.id,
      pfProjectValidatorDocumentsID
    );
  
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
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".zip"
      />
      <Button variant="primary" size="md" onClick={handleButtonClick}>
        Subir zip
      </Button>
    </div>
  );
}
