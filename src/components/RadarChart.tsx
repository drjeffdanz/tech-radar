import { useState } from "react";
import type { RadarEntry } from "../types";
import {
  CHART_SIZE,
  CX,
  CY,
  QUADRANTS,
  RINGS,
  RING_RADII,
  QUADRANT_ANGLES,
  QUADRANT_COLORS,
  sectorPath,
  ringLabelPosition,
} from "../utils/radar-math";
import { RadarBlip } from "./RadarBlip";
import { Tooltip } from "./Tooltip";

interface RadarChartProps {
  entries: RadarEntry[];
}

// Quadrant label positions (text anchor points in the outermost ring area)
function quadrantLabelPosition(quadrantName: string): { x: number; y: number; textAnchor: string } {
  const [startDeg, endDeg] = QUADRANT_ANGLES[quadrantName];
  const midDeg = (startDeg + endDeg) / 2;
  const r = RING_RADII[3] + 14; // just outside outermost ring
  const angleRad = (midDeg * Math.PI) / 180;
  const x = CX + r * Math.cos(angleRad);
  const y = CY - r * Math.sin(angleRad);

  // text-anchor based on which side of chart
  let textAnchor = "middle";
  if (x < CX - 10) textAnchor = "end";
  else if (x > CX + 10) textAnchor = "start";

  return { x, y, textAnchor };
}

export function RadarChart({ entries }: RadarChartProps) {
  const [hoveredEntry, setHoveredEntry] = useState<RadarEntry | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleHover = (entry: RadarEntry | null, x: number, y: number) => {
    setHoveredEntry(entry);
    setTooltipPos({ x, y });
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 680, margin: "0 auto" }}>
      <svg
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        width="100%"
        style={{ display: "block", aspectRatio: "1/1" }}
        aria-label="Technology Radar Chart"
        role="img"
      >
        <title>Technology Radar</title>

        {/* Background */}
        <rect width={CHART_SIZE} height={CHART_SIZE} fill="var(--color-dark)" />

        {/* Ring sectors — colored by quadrant */}
        {QUADRANTS.map((quadrant) =>
          RINGS.map((_, ringIndex) => (
            <path
              key={`${quadrant}-${ringIndex}`}
              d={sectorPath(quadrant, ringIndex)}
              fill={QUADRANT_COLORS[quadrant]}
              fillOpacity={0.04}
              stroke="var(--color-dark-border)"
              strokeWidth={0.5}
            />
          ))
        )}

        {/* Ring border circles */}
        {RING_RADII.map((r, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="var(--color-dark-border)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        <line
          x1={CX}
          y1={0}
          x2={CX}
          y2={CHART_SIZE}
          stroke="var(--color-dark-border)"
          strokeWidth={1}
        />
        <line
          x1={0}
          y1={CY}
          x2={CHART_SIZE}
          y2={CY}
          stroke="var(--color-dark-border)"
          strokeWidth={1}
        />

        {/* Ring labels */}
        {RINGS.map((ring, i) => {
          const pos = ringLabelPosition(i);
          return (
            <text
              key={ring}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3a3a3a"
              fontSize={9}
              fontFamily="var(--font-mono)"
              letterSpacing="0.1em"
            >
              {ring.toUpperCase()}
            </text>
          );
        })}

        {/* Quadrant labels */}
        {QUADRANTS.map((quadrant) => {
          const pos = quadrantLabelPosition(quadrant);
          const color = QUADRANT_COLORS[quadrant];
          // Short label to fit
          const shortLabel = quadrant === "Languages & Frameworks" ? "Languages" : quadrant;
          return (
            <text
              key={quadrant}
              x={pos.x}
              y={pos.y}
              textAnchor={pos.textAnchor as "start" | "middle" | "end"}
              dominantBaseline="middle"
              fill={color}
              fillOpacity={0.7}
              fontSize={10}
              fontFamily="var(--font-sans)"
              fontWeight={600}
              letterSpacing="0.05em"
            >
              {shortLabel.toUpperCase()}
            </text>
          );
        })}

        {/* Blips */}
        {entries.map((entry) => (
          <RadarBlip
            key={entry.id}
            entry={entry}
            onHover={handleHover}
            isHighlighted={hoveredEntry?.id === entry.id}
          />
        ))}
      </svg>

      {hoveredEntry && (
        <Tooltip entry={hoveredEntry} x={tooltipPos.x} y={tooltipPos.y} />
      )}
    </div>
  );
}
