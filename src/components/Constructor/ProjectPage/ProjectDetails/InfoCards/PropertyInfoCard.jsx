import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function PropertyInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header
        title="Aspectos generales del predio"
        sep={true}
      />
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <FormGroup
              disabled
              label="¿Usted habita el predio?"
              inputType="radio"
              optionList={["Si", "No"]}
              optionCheckedList={
                projectData.projectGeneralAspects?.postulant.livesOnProperty
              }
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              label="¿Existen caminos vecinales o servidumbres de paso a otras fincas?"
              inputType="radio"
              optionList={["Si", "No"]}
              optionCheckedList={
                projectData.projectGeneralAspects?.neighborhoodRoads
              }
            />
          </div>
          {projectData.projectGeneralAspects?.postulant.livesOnProperty ===
            "Si" && (
            <div className="col">
              <FormGroup
                disabled
                label="¿Usted habita el predio de manera temporal o permanente?"
                inputType="radio"
                optionList={["Temporal", "Permanente"]}
                optionCheckedList={
                  projectData.projectGeneralAspects?.postulant.typeOfStay
                }
              />
            </div>
          )}
          {projectData.projectGeneralAspects?.postulant.typeOfStay ===
            "Permanente" && (
            <div className="col">
              <FormGroup
                disabled
                label="¿Desde hace cuántos años ha estado habitando el predio?"
                inputType="radio"
                optionList={["Temporal", "Permanente"]}
                optionCheckedList={
                  projectData.projectGeneralAspects?.postulant.timeLivingOnProperty
                }
              />
            </div>
          )}
          <div className="col">
            <FormGroup
              disabled
              inputType="text"
              label="¿Cuántas viviendas hay en el predio(s)?"
              inputValue={projectData.projectGeneralAspects?.households}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="text"
              label="¿Cuántas familas?"
              inputValue={projectData.projectGeneralAspects?.familiesNumber}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="text"
              label="¿Cuál es el estado de las vías de ingreso a su propiedad?"
              inputValue={projectData.projectGeneralAspects?.roadsStatus}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="text"
              label="¿Cuál es la distancia en kilómetros entre el predio y la cabecera municipal?"
              inputValue={projectData.projectGeneralAspects?.municipalDistance}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="text"
              label="¿Qué medio de transporte utiliza?"
              inputValue={projectData.projectGeneralAspects?.conveyance}
            />
          </div>
          <div className="col-12 col-lg-12">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿En su predio existen riesgos de erosión o derrumbes?"
              inputValue={projectData.projectGeneralAspects?.collapseRisk}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
