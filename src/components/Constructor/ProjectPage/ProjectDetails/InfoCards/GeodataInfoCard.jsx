import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Card from "../../../../common/Card";
// Borrar despues de pasar a componentes

export default class GeodataInfoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const coords = this.props.coords || { lat: 7, lng: -73 };
    const zoom = this.props.zoom || 12;
    const geoData = this.props.geoData || null;

    return (
      <Card>
        <Card.Header title="Ubicación" sep={true} />
        <div style={{ height: "570px", width: "100%" }}>
          {coords.lat && coords.lng && zoom && (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyCzXTla3o3V7o72HS_mvJfpVaIcglon38U",
              }}
              defaultCenter={coords}
              defaultZoom={zoom}
              onGoogleApiLoaded={({ map, maps }) => {
                geoData.map((data) => {
                  new maps.KmlLayer(data.fileURLS3, {
                    suppressInfoWindows: true,
                    preserveViewport: false,
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
            ></GoogleMapReact>
          )}
        </div>
      </Card>
    );
  }
}
