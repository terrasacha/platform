import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function UseRestrictionsInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header
        title="Limitaciones de uso de suelo"
        sep={true}
      />
      <Card.Body>
        <div className="row row-cols-1">
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="Restricción de uso por encontrarse inmerso en áreas de protección declaradas como parques, zonas de reserva, otros"
              inputValue={projectData.projectRestrictions?.desc}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="Otros limitantes"
              inputValue={projectData.projectRestrictions?.other}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
