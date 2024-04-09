import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Card from "../../../../common/Card";
import { Button, Form } from "react-bootstrap";
import { useProjectData } from "context/ProjectDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import { notify } from "utilities/notify";
import { getPolygonByCadastralNumber } from "services/getPolygonByCadastralNumber";
import { getPredialDataByCadastralNumber } from "services/getPredialDataByCadastralNumber";
import { getPredialData2ByCadastralNumber } from "services/getPredialData2ByCadastralNumber";
// Borrar despues de pasar a componentes

export default function GeodataInfoCard(props) {
  const { autorizedUser, setProgressChange, tooltip } = props;
  const { projectData } = useProjectData();

  const [ubicacionPfId, setUbicacionPfId] = useState(null);
  const [polygonsFetchedData, setPolygonsFetchedData] = useState(null);

  const [formData, setFormData] = useState({
    coords: {
      lat: 0,
      lng: 0,
    },
  });
  const [geoData, setGeoData] = useState({
    coords: {
      lat: 4.73,
      lng: -74.03,
    },
    zoom: 6,
    layers: [],
    loaded: false,
  });

  useEffect(() => {
    async function updatePredialData() {
      const cadastralNumbersArray =
        projectData.projectCadastralRecords.cadastralRecords.map(
          (item) => item.cadastralNumber
        );
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
        polygonGeoJson.features = polygonGeoJson.features.map((feature, index) => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              ...predialData[feature.properties.CODIGO],
              ...predialData2[feature.properties.CODIGO]
            }
          }
        });
      }
      console.log("polygonGeoJson", polygonGeoJson);
      console.log("predialData", predialData);
      console.log("predialData2", predialData2);
      setPolygonsFetchedData(polygonGeoJson);
    }

    updatePredialData();
  }, [projectData]);

  useEffect(() => {
    if (projectData && projectData.projectGeoData && projectData.projectInfo) {
      const pfID =
        projectData.projectFeatures.filter((item) => {
          return item.featureID === "C_ubicacion";
        })[0]?.id || null;
      setUbicacionPfId(pfID);

      if (projectData?.projectInfo?.location.coords.lat !== "") {
        setGeoData((prevState) => ({
          ...prevState,
          coords: {
            lat: projectData?.projectInfo?.location.coords.lat,
            lng: projectData?.projectInfo?.location.coords.lng,
          },
          layers: projectData.projectGeoData,
          zoom: 12,
          loaded: true,
        }));
        setFormData((prevState) => ({
          ...prevState,
          coords: {
            lat: projectData?.projectInfo?.location.coords.lat,
            lng: projectData?.projectInfo?.location.coords.lng,
          },
        }));
      } else {
        setGeoData((prevState) => ({
          ...prevState,
          loaded: true,
        }));
      }
    }
  }, [projectData]);

  //let markers = [];

  return (
    <Card>
      <Card.Header title="Ubicación Geográfica" sep={true} tooltip={tooltip} />
      <div style={{ height: "570px", width: "100%" }}>
        {polygonsFetchedData && (
          <>
            <GoogleMapReact
              // key={new Date().getTime()}
              bootstrapURLKeys={{
                key: "AIzaSyCzXTla3o3V7o72HS_mvJfpVaIcglon38U",
              }}
              defaultCenter={geoData.coords}
              defaultZoom={6}
              onGoogleApiLoaded={({ map, maps }) => {
                map.setZoom(geoData.zoom);

                if (polygonsFetchedData.features.length > 0) {
                  // Load GeoJSON.
                  map.data.addGeoJson(polygonsFetchedData);

                  // Create empty bounds object
                  let bounds = new maps.LatLngBounds();

                  map.data.addListener("click", (event) => {
                    const titulo = event.feature.getProperty("DIRECCION");
                    const codigo = event.feature.getProperty("CODIGO");
                    const departamento = event.feature.getProperty("NOMBRE_DEPARTAMENTO");
                    const municipio = event.feature.getProperty("NOMBRE_MUNICIPIO");
                    const destinoEconomico = event.feature.getProperty("NOMBRE_DESTINOECONOMICO");
                    const descripcionDestinoEconomico = event.feature.getProperty("DESCRIPCION_DESTINOECONOMICO");
                    const areaTerreno = event.feature.getProperty("AREA_TERRENO");
                    const areaConstruida = event.feature.getProperty("AREA_CONSTRUIDA");
                    const contentString = `
                      <div class='infoWindowContainer'>
                        <p>${titulo}</p>
                        <p class='mb-0'>Identificador catastral: ${codigo}</p>
                        <p class='mb-0'>Departamento: ${departamento}</p>
                        <p class='mb-0'>Municipio: ${municipio}</p>
                        <p class='mb-0'>Destino económico: ${destinoEconomico} (${descripcionDestinoEconomico})</p>
                        <p class='mb-0'>Área de terreno: ${parseFloat(areaTerreno).toLocaleString('es-ES')} m2</p>
                        <p class='mb-0'>Área construida: ${parseFloat(areaConstruida).toLocaleString('es-ES')} m2</p>
                      </div>
                    `;

                    let infoWindow = new maps.InfoWindow({
                      content: contentString,
                      ariaLabel: codigo,
                    });
                    //setInfoWindow(infoWindow);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map, event.latLng);
                  });

                  // Calcular centroide
                  map.data.forEach(function (feature) {
                    var geo = feature.getGeometry();

                    geo.forEachLatLng(function (LatLng) {
                      bounds.extend(LatLng);
                    });
                  });

                  // Setear centroide
                  map.fitBounds(bounds);
                }
              }}
              yesIWantToUseGoogleMapApiInternals
            >
              {/* <Marker lat={formData.coords?.lat} lng={formData.coords?.lng} /> */}
            </GoogleMapReact>
          </>
        )}
      </div>
    </Card>
  );
}
