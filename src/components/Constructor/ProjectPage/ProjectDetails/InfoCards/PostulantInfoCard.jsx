import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function PostulantInfoCard(props) {
    const { className } = props;
    const { projectData } = useProjectData();
    
    return (
      <Card className={className}>
        <Card.Header
          title="Información del postulante"
          sep={true}
        />
        <Card.Body>
          <div className="row row-cols-1 row row-cols-md-2">
            <div className="col">
              <FormGroup
                disabled
                label="Nombre del postulante"
                inputValue={projectData.projectPostulant?.name}
              />
              <FormGroup
                disabled
                label="Tipo de documento"
                inputType="radio"
                optionList={[
                  { label: "CC", value: "CC" },
                  { label: "NIT", value: "NIT" },
                ]}
                optionCheckedList={projectData.projectPostulant?.docType}
              />
            </div>
            <div className="col">
              <FormGroup
                disabled
                label="Correo electrónico"
                inputValue={projectData.projectPostulant?.email}
              />
              <FormGroup
                disabled
                label="Número de identificación"
                inputValue={projectData.projectPostulant?.docNumber}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
}
