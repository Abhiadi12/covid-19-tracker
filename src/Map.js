import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, MapConsumer } from "react-leaflet";
import "./map.css";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} />
      {showDataOnMap(countries, casesType)}
      <MapConsumer>
        {(map) => {
          map.flyTo(center, zoom);
          return null;
        }}
      </MapConsumer>
    </MapContainer>
  );
}

export default Map;
