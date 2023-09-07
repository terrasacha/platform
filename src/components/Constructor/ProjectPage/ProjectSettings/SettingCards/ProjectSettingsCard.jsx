import React, { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";

import { useProjectData } from "../../../../../context/ProjectDataContext";
import { updateProduct } from "../../../../../graphql/mutations";

export default function ProjectSettingsCard(props) {
  const { className } = props;

  const { projectData } = useProjectData()
  const [projectIsActive, setProjectIsActive] = useState(false);

  useEffect(() => {
    if (projectData) {
      setProjectIsActive(projectData.projectInfo.isActive);
    }
  }, [projectData]);

  const handleChangeProjectIsActiveStatus = async() => {
    setProjectIsActive(!projectIsActive);
    let updatedProduct = {
      id: projectData.projectInfo.id,
      isActive: !projectIsActive
    }
    API.graphql(
      graphqlOperation(updateProduct, { input: updatedProduct })
    );

  }

  return (
    <Card className={className}>
      <Card.Header title="Configuración del Proyecto" sep={true}/>
      <Card.Body>
        <FormGroup
          label="Proyecto visible en Marketplace"
          inputType="switch"
          checked={projectIsActive}
          onChangeInputValue={() => handleChangeProjectIsActiveStatus()}
        />
      </Card.Body>
    </Card>
  );
}
