import React, { useEffect, useState } from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import Card from "components/common/Card";
import { getPolygonByCadastralNumber } from "services/getPolygonByCadastralNumber";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { getPredialData2ByCadastralNumber } from "services/getPredialData2ByCadastralNumber";
import { generateJSONFile } from "utilities/generateJsonFile";
import { Button } from "react-bootstrap";
import BarGraphComponent from "./BarGraphComponent";
import SankeyGraphComponent from "./SankeyGraphComponent";
export default function ProjectAnalysis({ visible }) {
  const { projectData } = useProjectData();
  const [comparativeAnalysis, setComparativeAnalysis] = useState(null);

  useEffect(() => {
    handleComparativeAreaAnalysis();
  }, []);

  const getPolygonGeoJson = async () => {
    const cadastralNumbersArray =
      projectData.projectCadastralRecords.cadastralRecords.map(
        (item) => item.cadastralNumber
      );

    if (cadastralNumbersArray.length > 0) {
      let polygonGeoJson = await getPolygonByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      const predialData = await getPredialDataByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      const predialData2 = await getPredialData2ByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData

      if (polygonGeoJson) {
        polygonGeoJson.features = polygonGeoJson.features.map(
          (feature, index) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                ...predialData[feature.properties.CODIGO],
                ...predialData2[feature.properties.CODIGO],
              },
            };
          }
        );
      }

      return polygonGeoJson;
    }

    alert(
      "No hay datos disponibles para descargar (El proyecto no tiene información predial asociada)"
    );
    return null;
  };

  const handleDownloadGeoJsonButton = async () => {
    const geoJsonPolygonsObject = await getPolygonGeoJson();
    if (geoJsonPolygonsObject) {
      const finalObject = {
        projectID: projectData.projectInfo.id,
        geoJson: geoJsonPolygonsObject,
      };
      generateJSONFile(finalObject, projectData.projectInfo.id);
    }
  };

  const handleComparativeAreaAnalysis = async () => {
    const comparativeFile = projectData.projectFeatures.find(
      (item) => item.featureID === "comparative_area_analysis"
    );
    if (!comparativeFile) return;
    const response = await fetch(
      `https://kiosuanbcrjsappcad3eb2dd1b14457b491c910d5aa45dd145518-dev.s3.amazonaws.com/public/${projectData.projectInfo.id}/data/${comparativeFile.value}`
    );
    const data = await response.json();
    return setComparativeAnalysis(data);
  };
  return (
    <>
      {visible && (
        <div className="row row-cols-1 g-4">
          <div className="col-12">
            <Card>
              <Card.Header title="Analisis" sep={true} />
              <Card.Body>
                <div className="d-flex align-items-center">
                  <p className="mb-0 me-4">Descargar datos de poligonos:</p>
                  <Button className="" onClick={handleDownloadGeoJsonButton}>
                    JSON File
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12">
            <Card>
              <Card.Header title="Análisis Comparativo de Áreas" sep={true} />
              <Card.Body>
                <div class="d-flex justify-content-center align-items-center mb-24">
                  <div class="d-flex flex-column w-5/6 align-items-center gap-4">
                    {comparativeAnalysis ? (
                      <>
                        <h4>Evolución de áreas</h4>
                        <BarGraphComponent
                          infoBarGraph={comparativeAnalysis.graphJSON_barras}
                        />
                        <h4 class="pt-4">
                          Diagrama de Sankey - Cambios en Vegetación
                        </h4>
                        <SankeyGraphComponent
                          infoSankeyGraph={comparativeAnalysis.graphJSON_sankey}
                        />
                      </>
                    ) : (
                      <p className="mb-0 me-4">
                        La información no se encuentra disponible
                      </p>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
