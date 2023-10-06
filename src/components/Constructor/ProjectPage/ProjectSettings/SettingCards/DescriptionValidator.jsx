import React, { useEffect, useState } from "react";

import Card from "../../../../common/Card";
import { SaveDiskIcon } from "../../../../common/icons/SaveDiskIcon";
import { useProjectData } from "../../../../../context/ProjectDataContext";
import { notify } from "../../../../../utilities/notify";
import { Form, Button } from "react-bootstrap";
import { createProductFeature } from "graphql/mutations";
import { updateProductFeature } from "graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

export default function DescriptionValidator(props) {
  const { className } = props;

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
    <Card className={className}>
      <Card.Header title="Descripción detallada del proyecto" sep={true} />
      <Card.Body>
        <Form.Control
            as="textarea"
            style={{ minHeight:'10rem', maxHeight: "20rem", resize: "none" }}
            value={projectDescription}
            onChange={handleOnChange}
            />
        <div className="d-flex justify-content-end mt-3">
            <Button
            variant="success"
            disabled={projectDescription.length === 0 || projectDescription === projectData.projectVerifierInfo.verifierDescription}
            onClick={() => saveVerifierDescription()}
            >
            <SaveDiskIcon />
            </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
