import React from "react";
import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function PostulantInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <div className={className}>
  <div className="border-b border-gray-300">
    <h2 className="text-xl font-semibold mb-4">Información del postulante</h2>
  </div>
  <div className="p-6">
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
