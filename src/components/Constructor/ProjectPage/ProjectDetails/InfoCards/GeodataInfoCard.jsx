import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import Card from "../../../../common/Card";
import Button from "../../../../ui/Button";
import Form from "../../../../ui/Form";
import { useProjectData } from "context/ProjectDataContext";
import { API, graphqlOperation } from "aws-amplify";
import { createProductFeature, updateProductFeature } from "graphql/mutations";
import { notify } from "utilities/notify";

export default function GeodataInfoCard(props) {
  const { autorizedUser, setProgressChange, tooltip } = props;
  const { projectData } = useProjectData();

  const [ubicacionPfId, setUbicacionPfId] = useState(null);

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
    <div classname="container container mx-auto sm:px-4">
      <div classname="card relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
        <div classname="card-body relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
          <h5 classname="card-title relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">Ubicación Geográfica</h5>
          <div style={{ height: "570px", width: "100%" }}>
            {geoData.loaded && (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyCzXTla3o3V7o72HS_mvJfpVaIcglon38U",
                }}
                defaultCenter={geoData.coords}
                defaultZoom={6}
                onClick={onMapClick}
                onGoogleApiLoaded={({ map, maps }) => {
                  map.setZoom(geoData.zoom);
                  geoData.layers.forEach((data) => {
                    new maps.KmlLayer(data.fileURLS3, {
                      suppressInfoWindows: true,
                      preserveViewport: true,
                      map: map,
                    }).addListener("click", function (event) {
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
              <label className="mb-0">Latitud</label>
              <input
                disabled={true}
                className="form-control form-control-sm"
                type="number"
                value={formData.coords?.lat}
              />
            </div>
            <div>
              <label className="mb-0">Longitud</label>
              <input
                disabled={true}
                className="form-control form-control-sm"
                type="number"
                value={formData.coords?.lng}
              />
            </div>
          </div>
          {autorizedUser && (
            <div classname="d-flex justify-content-center mb-3 flex">
              <button onClick={() => handleSaveBtn()} variant="success">
                Actualizar Ubicación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
