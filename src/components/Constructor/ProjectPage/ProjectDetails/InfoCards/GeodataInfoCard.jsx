import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Card from "../../../../common/Card";
import { Button, Form } from "react-bootstrap";
import { useProjectData } from "context/ProjectDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import { notify } from "utilities/notify";
import * as turf from "@turf/turf";
import { getPolygonByCadastralNumber } from "services/getPolygonByCadastralNumber";
// Borrar despues de pasar a componentes

export default function GeodataInfoCard(props) {
  const { autorizedUser, setProgressChange, tooltip } = props;
  const { projectData } = useProjectData();

  const [ubicacionPfId, setUbicacionPfId] = useState(null);
  const [polygonsFetchedData, setPolygonsFetchedData] = useState([]);

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
      const predialData = await getPolygonByCadastralNumber(
        cadastralNumbersArray
      ); // Llamada a la función getData
      console.log(predialData);
      setPolygonsFetchedData(predialData);
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

  function onMapClick({ x, y, lat, lng, event }) {
    if (autorizedUser) {
      setFormData((prevState) => ({
        ...prevState,
        coords: {
          lat: lat,
          lng: lng,
        },
      }));
    }
  }

  const Marker = ({ show, place }) => {
    const markerStyle = {
      border: "1px solid white",
      borderRadius: "50%",
      height: 10,
      width: 10,
      backgroundColor: show ? "red" : "blue",
      cursor: "pointer",
      zIndex: 10,
    };

    return (
      <>
        <div style={markerStyle} />
      </>
    );
  };

  const handleSaveBtn = async () => {
    if (ubicacionPfId) {
      const updatedProductFeature = {
        id: ubicacionPfId,
        value: `${formData.coords.lat}, ${formData.coords.lng} 0 0`,
      };
      console.log("newProductFeature:", updatedProductFeature);
      await API.graphql(
        graphqlOperation(updateProductFeature, {
          input: updatedProductFeature,
        })
      );
    } else {
      const newProductFeature = {
        featureID: "C_ubicacion",
        productID: projectData.projectInfo.id,
        value: `${formData.coords.lat}, ${formData.coords.lng} 0 0`,
      };
      console.log("newProductFeature:", newProductFeature);
      const response = await API.graphql(
        graphqlOperation(createProductFeature, { input: newProductFeature })
      );
      setUbicacionPfId(response.data.createProductFeature.id);
    }
    setProgressChange(true);
    notify({ msg: "Ubicación del predio actualizada", type: "success" });
  };

  return (
    <Card>
      <Card.Header title="Ubicación Geográfica" sep={true} tooltip={tooltip} />
      <div style={{ height: "570px", width: "100%" }}>
        {(polygonsFetchedData.length > 0) && (
          <GoogleMapReact
            // key={new Date().getTime()}
            bootstrapURLKeys={{
              key: "AIzaSyCzXTla3o3V7o72HS_mvJfpVaIcglon38U",
            }}
            defaultCenter={geoData.coords}
            defaultZoom={6}
            onClick={onMapClick}
            onGoogleApiLoaded={({ map, maps }) => {
              map.setZoom(geoData.zoom);
              console.log(polygonsFetchedData,"polygonsFetchedData")
              polygonsFetchedData.forEach((data) => {
                new maps.Polygon({
                  paths: data.poligono,
                  strokeColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6), // Color de la línea del polígono
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6), // Color del relleno del polígono
                  fillOpacity: 0.35,
                  map: map,
                }).addListener("click", function (event) {
                  // infowindow.open({
                  //   anchor: this,
                  //   map,
                  // });
                  console.log("Hizo click en " + data.predio);
                });
              });
              // var polygon = new maps.Polygon({
              //   paths: convertToGoogleMapsPaths(coords),
              //   strokeColor: "#FF0000", // Color de la línea del polígono
              //   strokeOpacity: 0.8,
              //   strokeWeight: 2,
              //   fillColor: "#FF0000", // Color del relleno del polígono
              //   fillOpacity: 0.35,
              // });

              //polygon.setMap(map);
              geoData.layers.forEach((data) => {
                new maps.KmlLayer(data.fileURLS3, {
                  suppressInfoWindows: true,
                  preserveViewport: true,
                  map: map,
                }).addListener("click", function (event) {
                  // infowindow.open({
                  //   anchor: this,
                  //   map,
                  // });
                  console.log("Hizo click");
                });
              });
            }}
            yesIWantToUseGoogleMapApiInternals
          >
            <Marker lat={formData.coords?.lat} lng={formData.coords?.lng} />
          </GoogleMapReact>
        )}
      </div>
      <div className="p-3">
        <div>
          <Form.Label className="mb-0">Latitud</Form.Label>
          <Form.Control
            disabled={true}
            size="sm"
            type="number"
            value={formData.coords?.lat}
          />
        </div>
        <div>
          <Form.Label className="mb-0">Longitud</Form.Label>
          <Form.Control
            disabled={true}
            size="sm"
            type="number"
            value={formData.coords?.lng}
          />
        </div>
      </div>
      {autorizedUser && (
        <div className="d-flex justify-content-center mb-3">
          <Button onClick={() => handleSaveBtn()} variant="success">
            Actualizar Ubicación
          </Button>
        </div>
      )}
    </Card>
  );
}
