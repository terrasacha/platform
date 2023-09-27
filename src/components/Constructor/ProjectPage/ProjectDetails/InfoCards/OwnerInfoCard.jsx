import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function OwnerInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header title="Información del titular" sep={true} />
      <Card.Body>
        <div className="row">
          <div className="col-12 col-md-6">
            <FormGroup
              disabled
              label="Nombre del titular"
              inputValue={projectData.projectOwner?.name}
            />
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                <FormGroup
                  disabled
                  label="Tipo de documento"
                  inputType="radio"
                  optionList={[
                    { label: "CC", value: "CC" },
                    { label: "NIT", value: "NIT" },
                  ]}
                  optionCheckedList={projectData.projectOwner?.docType}
                />
              </div>
              <div className="col-6">
                <FormGroup
                  disabled
                  label="Número de identificación"
                  inputValue={projectData.projectOwner?.docNumber}
                />
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
