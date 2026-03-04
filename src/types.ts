export type Ring = "Adopt" | "Trial" | "Assess" | "Hold";
export type Quadrant =
  | "Languages & Frameworks"
  | "Platforms"
  | "Tools"
  | "Techniques";
export type Status = "new" | "moved-in" | "moved-out" | "no-change";

export interface RadarEntry {
  id: string;
  label: string;
  ring: Ring;
  quadrant: Quadrant;
  status: Status;
  description: string;
  tags?: string[];
  since?: string;
}

export interface RadarData {
  version: string;
  title: string;
  updated: string;
  entries: RadarEntry[];
}
