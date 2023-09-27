import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function EcosystemInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header
        title="Aspectos generales del ecosistema"
        sep={true}
      />
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <FormGroup
              disabled
              label="¿Existen Nacimientos de agua?"
              inputType="radio"
              optionList={[{ label: "Si", value: "Si" }, { label: "No", value: "No" }]}
              optionCheckedList={projectData.projectEcosystem?.waterSprings.exist}
            />
          </div>
          {
            projectData.projectEcosystem?.waterSprings.exist === "Si" &&
            <div className="col">
              <FormGroup
                disabled
                inputType="text"
                label="¿Cuántos nacimientos de agua existen?"
                inputValue={projectData.projectEcosystem?.waterSprings.quantity}
              />
            </div>
          }
          <div className="col">
            <FormGroup
              disabled
              label="¿Existen concesiones de agua?"
              inputType="radio"
              optionList={[{ label: "Si", value: "Si" }, { label: "No", value: "No" }]}
              optionCheckedList={projectData.projectEcosystem?.concessions.exist}
            />
          </div>
          {
            projectData.projectEcosystem?.concessions.exist === "Si" &&
            <div className="col">
              <FormGroup
                disabled
                inputType="text"
                label="Quien concede el agua"
                inputValue={projectData.projectEcosystem?.concessions.entity}
              />
            </div>
          }
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Qué amenazas de deforestación existen al interior del predio(s) y/o a los alrededores?"
              inputValue={projectData.projectEcosystem?.deforestationThreats}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Existe algún proyecto de conservación en su predio?"
              inputValue={projectData.projectEcosystem?.conservationProjects}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Cuenta con especies de fauna de importancia?"
              inputValue={projectData.projectEcosystem?.diversity.fauna}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Cuenta con caracterización de especies de mamiferos?"
              inputValue={projectData.projectEcosystem?.diversity.mammals}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Cuenta con caracterización de especies de aves?"
              inputValue={projectData.projectEcosystem?.diversity.birds}
            />
          </div>
          <div className="col">
            <FormGroup
              disabled
              inputType="textarea"
              label="¿Cuenta con caracterización de especies de flora?"
              inputValue={projectData.projectEcosystem?.diversity.flora}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
