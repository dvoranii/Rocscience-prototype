import { useEffect } from "react";
import type { Borehole } from "../../../../../types/borehole";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapBounds: React.FC<{
  boreholes: Borehole[];
  crossSectionLine?: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  };
}> = ({ boreholes, crossSectionLine }) => {
  const map = useMap();

  useEffect(() => {
    if (!boreholes.length) return;

    const allPoints: [number, number][] = [
      ...boreholes.map((bh) => [bh.lat, bh.lng] as [number, number]),
    ];

    if (crossSectionLine) {
      allPoints.push(
        [crossSectionLine.start.lat, crossSectionLine.start.lng],
        [crossSectionLine.end.lat, crossSectionLine.end.lng]
      );
    }

    const bounds = allPoints.reduce((acc, point) => {
      return acc.extend(point);
    }, L.latLngBounds(allPoints[0], allPoints[0]));

    map.fitBounds(bounds, {
      padding: [20, 20],
      maxZoom: 18,
    });
  }, [boreholes, crossSectionLine, map]);

  return null;
};

export default MapBounds;
