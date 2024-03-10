import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import { SaveDiskIcon } from "../../../../common/icons/SaveDiskIcon";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { notify } from "../../../../../utilities/notify";
import Button from "../../../../ui/Button";
import Form from "../../../../ui/Form";
import { createProductFeature } from "graphql/mutations";
import { updateProductFeature } from "graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

export default function DescriptionValidator(props) {
  const { className, canEdit } = props;

  const { projectData } = useProjectData();
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDescriptionID, setProjectDescriptionID] = useState("");

  useEffect(() => {
    if (projectData) {
        setProjectDescription(projectData.projectVerifierInfo.verifierDescription);
        setProjectDescriptionID(projectData.projectVerifierInfo.verifierDescriptionID);
    }
  }, [projectData]);
    const handleOnChange = (e) => {
    setProjectDescription(e.target.value);
    };

    async function saveVerifierDescription(){
        try {
            if(projectDescriptionID){
                let tempInput = {
                    id: projectDescriptionID,
                    value: projectDescription,
                }
                await API.graphql(graphqlOperation(updateProductFeature, {input: tempInput}))
                notifyFunction("Descripción del proyecto actualizada", "success")
            }else{
                let tempInput = {
                    value: projectDescription,
                    featureID: "GLOBAL_VERIFIER_DESCRIPTION",
                    productID: projectData.projectInfo.id
                }
                let result = await API.graphql(graphqlOperation(createProductFeature, {input: tempInput}))
                setProjectDescriptionID(result.data.createProductFeature.id)
                notifyFunction("Descripción del proyecto guardada", "success")
            }
        } catch (error) {
            notifyFunction("Error al guardar la descripción del proyecto", "error")
        }
    }
    async function notifyFunction(msg, type) {
    notify({
      msg: msg,
      type: type,
    });
  }

  return (
    <div className={`bg-white border border-gray-300 p-4 rounded-md ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Descripción detallada del proyecto</h2>
      <div className="mb-4">
        <textarea
          className="w-full h-40 resize-none border border-gray-300 p-2"
          value={projectDescription}
          disabled={canEdit}
          onChange={handleOnChange}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          className={`bg-green-500 text-white py-2 px-4 rounded ${
            projectDescription.length === 0 ||
            projectDescription === projectData.projectVerifierInfo.verifierDescription ||
            canEdit
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
          onClick={() => saveVerifierDescription()}
          disabled={projectDescription.length === 0 || projectDescription === projectData.projectVerifierInfo.verifierDescription || canEdit}
        >
          <SaveDiskIcon className="mr-2" />
          Guardar
        </button>
      </div>
    </div>
  );
}
