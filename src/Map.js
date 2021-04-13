import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "./map.css";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
  console.log(center);
  // const [activePark, setActivePark] = React.useState(null);
  // console.log(activePark);
  // function ChangeView({ center, zoom }) {
  //   const map = useMap();
  //   map.setView(center, zoom);
  //   return null;
  // }
  // const map = useMapEvents({
  //   locationfound(e) {
  //     map.flyTo(center, zoom);
  //   },
  // });
  const mapRef = useRef();

  // function changeView() {
  //   const { current = {} } = mapRef;
  //   const { leafletElement: map } = current;

  //   map.flyTo(center, zoom, {
  //     duration: 2,
  //   });
  // }
  // changeView();
  // return (
  //   <MapContainer
  //     casesType={casesType}
  //     className="map"
  //     center={center}
  //     zoom={zoom}
  //     scrollWheelZoom={false}
  //   >
  //     <ChangeView center={center} zoom={zoom} />
  //     <TileLayer
  //       attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  //       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //     />
  //     {showDataOnMap(countries, casesType)}
  //   </MapContainer>
  // );
  // ChangeView({ center, zoom });
  React.useEffect(() => {
    function changeView() {
      const { current = {} } = mapRef;
      const { leafletElement: map } = current;
      console.log(mapRef.current);
      //   setTimeout(() => {
      //     map.flyTo(center, zoom, {
      //       duration: 2,
      //     });
      //   }, 2000);
    }
    changeView();
  }, []);
  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* {countries.map((country) => (
        <Marker
          key={country.country}
          position={[country.countryInfo.lat, country.countryInfo.long]}
          eventHandlers={{
            click: () => {
              setActivePark(country);
            },
          }}
        />
      ))}
      {activePark && (
        <Popup
          position={[activePark.countryInfo.lat, activePark.countryInfo.long]}
          onClose={() => setActivePark(null)}
        >
          <div>
            <h1>{activePark.country}</h1>
            <p> Today Cases : {activePark.todayCases}</p>
            <p> Today Deaths : {activePark.todayDeaths}</p>
            <p> Today Recovered : {activePark.todayRecovered}</p>
          </div>
        </Popup>
      )} */}
      {showDataOnMap(countries, casesType)}
    </MapContainer>
  );
}

export default Map;
