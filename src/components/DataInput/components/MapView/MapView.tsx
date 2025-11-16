import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import type { Borehole } from "../../../../types/borehole";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import MapBounds from "./MapBounds/MapBounds";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  boreholes: Borehole[];
  crossSectionLine?: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  };
}

const MapView: React.FC<MapViewProps> = ({ boreholes, crossSectionLine }) => {
  const centerLat =
    boreholes.reduce((sum, bh) => sum + bh.lat, 0) / boreholes.length;
  const centerLng =
    boreholes.reduce((sum, bh) => sum + bh.lng, 0) / boreholes.length;

  const getMaxDepth = (borehole: Borehole) => {
    return Math.max(...borehole.layers.map((layer) => layer.bottomDepth));
  };

  const lineCoordinates = crossSectionLine
    ? ([
        [crossSectionLine.start.lat, crossSectionLine.start.lng],
        [crossSectionLine.end.lat, crossSectionLine.end.lng],
      ] as [number, number][])
    : [];

  return (
    <div className="map-view">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <MapBounds boreholes={boreholes} crossSectionLine={crossSectionLine} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {crossSectionLine && (
          <Polyline
            positions={lineCoordinates}
            color="red"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        {boreholes.map((borehole) => (
          <Marker key={borehole.id} position={[borehole.lat, borehole.lng]}>
            <Popup>
              <div className="borehole-popup">
                <h3>Borehole {borehole.id}</h3>
                <div>
                  <strong>Location:</strong> {borehole.lat.toFixed(4)},{" "}
                  {borehole.lng.toFixed(4)}
                </div>
                <div>
                  <strong>Elevation:</strong> {borehole.elevation}m
                </div>
                <div>
                  <strong>Total Depth:</strong> {getMaxDepth(borehole)}m
                </div>
                <div>
                  <strong>Layers:</strong> {borehole.layers.length}
                </div>

                <div className="layers-preview">
                  <h4>Stratigraphy:</h4>
                  {borehole.layers.map((layer) => (
                    <div key={layer.id} className="layer-preview">
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      {layer.material} ({layer.topDepth}-{layer.bottomDepth}m)
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
