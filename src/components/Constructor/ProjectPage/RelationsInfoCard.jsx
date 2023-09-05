import React from "react";

import Card from "../../common/Card";
import FormGroup from "../../common/FormGroup";

import { useProjectData } from "../../../context/ProjectDataContext";

export default function RelationsInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header
        title="Relaciones con entidades y aliados estratégicos"
        sep={true}
      />
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col-12 col-lg-12">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Recibe asistencia técnica en el predio?"
              inputValue={projectData.projectRelations?.technicalAssistance}
            />
          </div>
          <div className="col-12 col-lg-12">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Cuenta con aliados estratégicos?"
              inputValue={projectData.projectRelations?.strategicAllies}
            />
          </div>
          <div className="col-12 col-lg-12">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Pertenece a algún grupo comunitario?"
              inputValue={projectData.projectRelations?.communityGroups}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
