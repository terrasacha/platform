import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Card from "./Card";
// Borrar despues de pasar a componentes

export default class MapCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const coords = this.props.coords || { lat: 7, lng: -73 };
    const zoom = this.props.zoom || 12;

    return (
      <Card>
        <Card.Header title="Ubicación" sep={true} />
        <div style={{ height: "570px", width: "100%" }}>
          {coords.lat && coords.lng && zoom && (
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyCGDQSnXKQDzedzzwPpe07tRgY9My2Cz0U",
              }}
              defaultCenter={coords}
              defaultZoom={zoom}
            ></GoogleMapReact>
          )}
        </div>
      </Card>
    );
  }
}
