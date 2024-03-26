import React from "react";
import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function PostulantInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <div className={`card ${className}`}>
      <div className="card-header relative flex flex-col min-w-0 rounded break-words border  border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
        <h5 className="card-title relative flex flex-col min-w-0 rounded break-words relative flex flex-col relative flex-grow max-w-full flex-1 px-4">Información del postulante</h5>
      </div>
      <div className="card-body relative flex flex-col min-w-0 rounded break-words border  border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
          <div>
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
      </div>
    </div>
  );
}
