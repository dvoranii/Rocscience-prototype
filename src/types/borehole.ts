export interface Layer {
  id: number;
  material: string;
  description: string;
  color: string;
  topDepth: number;
  bottomDepth: number;
}

export interface Borehole {
  id: string;
  lat: number;
  lng: number;
  elevation: number;
  layers: Layer[];
}

export interface BoreholeData {
  name: string;
  boreholes: Borehole[];
}

export type TabType = "map" | "boreholes" | "diagram";
export type InfoTabType = "info" | "layers";
