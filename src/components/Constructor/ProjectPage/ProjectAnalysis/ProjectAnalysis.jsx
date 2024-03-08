import React, { useEffect, useState } from "react";
import { useProjectData } from "../../../../context/ProjectDataContext";
import Card from "components/common/Card";
import { getPolygonByCadastralNumber } from "services/getPolygonByCadastralNumber";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { getPredialData2ByCadastralNumber } from "services/getPredialData2ByCadastralNumber";
import { generateJSONFile } from "utilities/generateJsonFile";
import { Button } from "react-bootstrap";

export default function ProjectAnalysis({ visible }) {
  const { projectData } = useProjectData();

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

    alert('No hay datos disponibles para descargar (El proyecto no tiene información predial asociada)')
    return null
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

  return (
    <>
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
    </>
  );
}
