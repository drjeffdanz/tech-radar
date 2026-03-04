import type { RadarEntry } from "../types";
import { blipPosition, QUADRANT_COLORS } from "../utils/radar-math";

interface RadarBlipProps {
  entry: RadarEntry;
  onHover: (entry: RadarEntry | null, x: number, y: number) => void;
  isHighlighted: boolean;
}

function TriangleUp(props: { cx: number; cy: number; size: number; fill: string }) {
  const { cx, cy, size, fill } = props;
  const h = size * 0.866; // height of equilateral triangle
  const points = [
    `${cx},${cy - h * 0.67}`,
    `${cx - size / 2},${cy + h * 0.33}`,
    `${cx + size / 2},${cy + h * 0.33}`,
  ].join(" ");
  return <polygon points={points} fill={fill} />;
}

function TriangleDown(props: { cx: number; cy: number; size: number; fill: string }) {
  const { cx, cy, size, fill } = props;
  const h = size * 0.866;
  const points = [
    `${cx},${cy + h * 0.67}`,
    `${cx - size / 2},${cy - h * 0.33}`,
    `${cx + size / 2},${cy - h * 0.33}`,
  ].join(" ");
  return <polygon points={points} fill={fill} />;
}

export function RadarBlip({ entry, onHover, isHighlighted }: RadarBlipProps) {
  const { x, y } = blipPosition(entry);
  const isHold = entry.ring === "Hold";
  const fill = isHold ? "#666666" : QUADRANT_COLORS[entry.quadrant];
  const size = isHighlighted ? 14 : 10;
  const opacity = isHighlighted ? 1 : 0.85;

  const handleMouseEnter = (e: React.MouseEvent) => {
    onHover(entry, e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    onHover(entry, e.clientX, e.clientY);
  };
  const handleMouseLeave = () => {
    onHover(null, 0, 0);
  };

  const sharedProps = {
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: { cursor: "pointer" },
    opacity,
  };

  let shape: React.ReactNode;
  if (entry.status === "moved-out") {
    shape = <TriangleDown cx={x} cy={y} size={size} fill={fill} />;
  } else if (entry.status === "new" || entry.status === "moved-in") {
    shape = <TriangleUp cx={x} cy={y} size={size} fill={fill} />;
  } else {
    shape = <circle cx={x} cy={y} r={size / 2} fill={fill} />;
  }

  return (
    <g {...sharedProps} aria-label={`${entry.label} — ${entry.ring}`}>
      <title>{entry.label} ({entry.ring})</title>
      {/* Invisible larger hit area */}
      <circle cx={x} cy={y} r={12} fill="transparent" />
      {shape}
      {isHighlighted && (
        <circle
          cx={x}
          cy={y}
          r={size / 2 + 4}
          fill="none"
          stroke={fill}
          strokeWidth={1.5}
          opacity={0.5}
        />
      )}
    </g>
  );
}
