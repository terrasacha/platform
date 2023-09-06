import React from "react";

import Card from "../../../../common/Card";
import FormGroup from "../../../../common/FormGroup";
import { useProjectData } from "../../../../../context/ProjectDataContext";

export default function ActualUseAndPotentialInfoCard(props) {
  const { className } = props;
  const { projectData } = useProjectData();

  return (
    <Card className={className}>
      <Card.Header title="Uso actual y potencial" sep={true} />
      <Card.Body>
        <div className="row row-cols-1 row-cols-md-2">
          <div className="col">
            <FormGroup
              disabled
              label="Uso actual del suelo del predio"
              inputType="checkbox"
              optionList={[
                "Potreros",
                "Plantaciones Forestales 1",
                "Plantaciones Forestales 2",
                "Plantaciones Forestales 3",
                "Frutales 1",
                "Frutales 2",
                "Otros",
              ]}
              optionCheckedList={projectData.projectUses?.actualUse.types}
            />
            {projectData.projectUses?.actualUse.types.includes("Potreros") && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Potreros
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={projectData.projectUses?.actualUse.potreros.ha}
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes(
              "Plantaciones Forestales 1"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 1
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales1
                        .especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales1
                        .ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes(
              "Plantaciones Forestales 2"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 2
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales2
                        .especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales2
                        .ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes(
              "Plantaciones Forestales 3"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 3
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales3
                        .especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={
                      projectData.projectUses?.actualUse.plantacionesForestales3
                        .ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes(
              "Frutales 1"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Frutales 1
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.frutales1.especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={projectData.projectUses?.actualUse.frutales1.ha}
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes(
              "Frutales 2"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Frutales 2
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.frutales2.especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={projectData.projectUses?.actualUse.frutales2.ha}
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.actualUse.types.includes("Otros") && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Otros
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Especies"
                    inputValue={
                      projectData.projectUses?.actualUse.otros.especie
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de hectáreas"
                    inputValue={projectData.projectUses?.actualUse.otros.ha}
                  />
                </section>
              </Card>
            )}
          </div>
          <div className="col">
            <FormGroup
              disabled
              label="Usos actuales remplazables"
              inputType="checkbox"
              optionList={[
                "Potreros",
                "Plantaciones Forestales 1",
                "Plantaciones Forestales 2",
                "Plantaciones Forestales 3",
                "Frutales 1",
                "Frutales 2",
                "Otros",
              ]}
              optionCheckedList={projectData.projectUses?.replaceUse.types}
            />

            {projectData.projectUses?.replaceUse.types.includes("Potreros") && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Potreros
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse.potreros.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={projectData.projectUses?.replaceUse.potreros.ha}
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes(
              "Plantaciones Forestales 1"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 1
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales1.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales1.ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes(
              "Plantaciones Forestales 2"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 2
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales2.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales2.ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes(
              "Plantaciones Forestales 3"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Plantaciones Forestales 3
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales3.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={
                      projectData.projectUses?.replaceUse
                        .plantacionesForestales3.ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes(
              "Frutales 1"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Frutales 1
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse.frutales1.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={
                      projectData.projectUses?.replaceUse.frutales1.ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes(
              "Frutales 2"
            ) && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Frutales 2
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse.frutales2.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={
                      projectData.projectUses?.replaceUse.frutales2.ha
                    }
                  />
                </section>
              </Card>
            )}
            {projectData.projectUses?.replaceUse.types.includes("Otros") && (
              <Card className="shadow-sm mb-3">
                <header className="d-flex justify-content-center mt-2">
                  Otros
                </header>
                <section className="p-2">
                  <FormGroup
                    disabled
                    inputType="text"
                    label="¿A qué tipo de Uso de Suelo?"
                    inputValue={
                      projectData.projectUses?.replaceUse.otros.newUse
                    }
                  />
                  <FormGroup
                    disabled
                    inputType="text"
                    label="Cantidad de área a remplazar"
                    inputValue={projectData.projectUses?.replaceUse.otros.ha}
                  />
                </section>
              </Card>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
