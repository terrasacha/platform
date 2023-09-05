import React from "react";

import Card from "../../common/Card";
import FormGroup from "../../common/FormGroup";
import { useProjectData } from "../../../context/ProjectDataContext";

export default function ProjectInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header title="Información del proyecto" sep={true} />
      <Card.Body>
        <div className="row">
          <div className="col-12 col-md-6">
            <FormGroup
              disabled
              label="Nombre del proyecto"
              inputValue={projectData.projectInfo?.title}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormGroup
              disabled
              label="Área total (hectáreas)"
              inputValue={projectData.projectInfo?.area}
            />
          </div>
          <div className="col-12">
            <FormGroup
              disabled
              inputType="textarea"
              label="Descripción"
              inputValue={projectData.projectInfo?.description}
            />
          </div>
          <div className="col-12 col-md-6">
            <FormGroup
              disabled
              label="Categoria del proyecto"
              inputType="radio"
              optionList={["REDD++", "Proyecto Plantaciones"]}
              optionCheckedList={projectData.projectInfo?.category}
            />
          </div>
          <div className="col-12">
            <div className="row row-cols-1 row-cols-md-2">
              <FormGroup
                disabled
                label="Vereda al que pertenece el Predio"
                inputValue={projectData.projectInfo?.location.vereda}
              />
              <FormGroup
                disabled
                label="Municipio al que pertenece el predio"
                inputValue={projectData.projectInfo?.location.municipio}
              />
              <FormGroup
                disabled
                label="Número de matrícula inmobiliaria del predio"
                inputValue={projectData.projectInfo?.location.matricula}
              />
              <FormGroup
                disabled
                label="Número de ficha catastral que aparece en el impuesto predial del municipio del predio"
                inputValue={projectData.projectInfo?.location.fichaCatrastal}
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
