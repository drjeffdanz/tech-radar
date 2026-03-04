import type { RadarEntry } from "../types";

export const RINGS = ["Adopt", "Trial", "Assess", "Hold"] as const;
export const QUADRANTS = [
  "Languages & Frameworks",
  "Platforms",
  "Tools",
  "Techniques",
] as const;

export const RING_RADII = [75, 150, 225, 275];
export const CHART_SIZE = 600;
export const CX = CHART_SIZE / 2;
export const CY = CHART_SIZE / 2;

// Quadrant angle ranges: standard math angles (CCW from +x axis)
// SVG y-axis is inverted so upper-right = 0–90°
export const QUADRANT_ANGLES: Record<string, [number, number]> = {
  "Languages & Frameworks": [0, 90],
  Platforms: [90, 180],
  Tools: [180, 270],
  Techniques: [270, 360],
};

export const QUADRANT_COLORS: Record<string, string> = {
  "Languages & Frameworks": "#c8956c", // gold
  Platforms: "#7eb8c9", // blue
  Tools: "#9cc97e", // green
  Techniques: "#c97ea8", // pink
};

export const RING_COLORS: Record<string, string> = {
  Adopt: "#c8956c",
  Trial: "#7eb8c9",
  Assess: "#9b7ec9",
  Hold: "#666666",
};

// djb2 hash → linear congruential generator for deterministic blip positions
function seedRandom(seed: string): () => number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h) ^ seed.charCodeAt(i);
  }
  h = h >>> 0;
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 0xffffffff;
  };
}

export function blipPosition(entry: RadarEntry): { x: number; y: number } {
  const rng = seedRandom(entry.id);

  const [angleStart, angleEnd] = QUADRANT_ANGLES[entry.quadrant];
  const ringIndex = RINGS.indexOf(entry.ring as (typeof RINGS)[number]);

  const innerR = ringIndex === 0 ? 15 : RING_RADII[ringIndex - 1] + 10;
  const outerR = RING_RADII[ringIndex] - 10;

  const INSET_DEG = 6;
  const angleDeg =
    angleStart + INSET_DEG + rng() * (angleEnd - angleStart - INSET_DEG * 2);

  const r = innerR + rng() * (outerR - innerR);

  const angleRad = (angleDeg * Math.PI) / 180;
  const x = CX + r * Math.cos(angleRad);
  const y = CY - r * Math.sin(angleRad); // SVG y-axis inverted

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export function sectorPath(
  quadrantName: string,
  ringIndex: number
): string {
  const [startDeg, endDeg] = QUADRANT_ANGLES[quadrantName];
  const outerR = RING_RADII[ringIndex];
  const innerR = ringIndex === 0 ? 0 : RING_RADII[ringIndex - 1];

  const toRad = (d: number) => (d * Math.PI) / 180;
  const startRad = toRad(startDeg);
  const endRad = toRad(endDeg);

  // SVG y-axis is inverted: y = cy - r*sin(angle)
  const x1o = CX + outerR * Math.cos(startRad);
  const y1o = CY - outerR * Math.sin(startRad);
  const x2o = CX + outerR * Math.cos(endRad);
  const y2o = CY - outerR * Math.sin(endRad);

  if (innerR === 0) {
    // Pie slice (innermost ring)
    return `M ${CX} ${CY} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 0 ${x2o} ${y2o} Z`;
  }

  const x1i = CX + innerR * Math.cos(startRad);
  const y1i = CY - innerR * Math.sin(startRad);
  const x2i = CX + innerR * Math.cos(endRad);
  const y2i = CY - innerR * Math.sin(endRad);

  return [
    `M ${x1o} ${y1o}`,
    `A ${outerR} ${outerR} 0 0 0 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${innerR} ${innerR} 0 0 1 ${x1i} ${y1i}`,
    `Z`,
  ].join(" ");
}

// Label position for ring labels on the positive-x axis side
export function ringLabelPosition(ringIndex: number): { x: number; y: number } {
  const outerR = RING_RADII[ringIndex];
  const innerR = ringIndex === 0 ? 0 : RING_RADII[ringIndex - 1];
  const midR = (outerR + innerR) / 2;
  // Place label at 45° into the Languages & Frameworks quadrant (upper-right)
  const angleRad = (45 * Math.PI) / 180;
  return {
    x: CX + midR * Math.cos(angleRad),
    y: CY - midR * Math.sin(angleRad),
  };
}
