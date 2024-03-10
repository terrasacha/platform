import React, { useState } from "react";

import { API, graphqlOperation, Storage } from "aws-amplify";
import Card from "../../../../common/Card";
import Table from "../../../../ui/Table";
import Button from "../../../../ui/Button";
import Spinner from "../../../../ui/Spinner";
import { notify } from "../../../../../utilities/notify";
import NewValidatorFileModal from "components/Modals/NewValidatorFileModal";
import { TrashIcon } from "components/common/icons/TrashIcon";
import { DownloadIcon } from "components/common/icons/DownloadIcon";
import { convertAWSDatetimeToDate } from "../../utils";

import { useProjectData } from "context/ProjectDataContext";
import { deleteDocument, updateProductFeature } from "graphql/mutations";

export default function ValidatorFilesInfoCard(props) {
  const { className, isVerifier, projectValidatorFiles } = props;

  const { projectData, handleUpdateContextProjectFileValidators } =
    useProjectData();

  const handleDeleteVerificatorFile = async (indexToDelete) => {
    const updatedDocsData =
      projectData.projectFilesValidators.projectValidatorDocuments.filter(
        (_, index) => index !== indexToDelete
      );

    await handleUpdateContextProjectFileValidators({
      projectValidatorDocuments: updatedDocsData,
    });

    let docToDelete = {
      id: projectData.projectFilesValidators.projectValidatorDocuments[
        indexToDelete
      ].id,
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

  return (
    <div className={className}>
  <div className="border-b mb-4">
    <h5 className="text-xl font-semibold">Documentos del validador</h5>
  </div>
  <div className="text-center">
    {projectValidatorFiles.length > 0 ? (
      <table className="w-full">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ultima actualización</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {projectValidatorFiles?.map((file, fileIndex) => (
            <tr key={file.id}>
              <td>{file.docTitle}</td>
              <td>{convertAWSDatetimeToDate(file.createdAt)}</td>
              <td className="text-end">
                <a href={file.fileURLS3} target="_blank" rel="noreferrer">
                  <button className="m-1 bg-blue-500 text-white py-1 px-2 rounded-md">
                    <DownloadIcon />
                  </button>
                </a>
                {isVerifier && (
                  <button
                    className="m-1 bg-red-500 text-white py-1 px-2 rounded-md"
                    onClick={() => handleDeleteVerificatorFile(fileIndex)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center">
        Aún no se han subido documentos por parte de los validadores
      </div>
    )}
  </div>
  {isVerifier && (
    <div className="border-t mt-4 pt-4">
      <div className="text-center">
        <NewValidatorFileModal />
      </div>
    </div>
  )}
</div>
  );
}
