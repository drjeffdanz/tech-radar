import type { RadarEntry } from "../types";
import { QUADRANT_COLORS, RING_COLORS } from "../utils/radar-math";

interface TooltipProps {
  entry: RadarEntry;
  x: number;
  y: number;
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  "moved-in": "Moved In ↑",
  "moved-out": "Moved Out ↓",
  "no-change": "No Change",
};

export function Tooltip({ entry, x, y }: TooltipProps) {
  const quadrantColor = QUADRANT_COLORS[entry.quadrant];
  const ringColor = RING_COLORS[entry.ring];

  // Offset tooltip from cursor
  const offsetX = 16;
  const offsetY = -12;

  return (
    <div
      role="tooltip"
      style={{
        position: "fixed",
        left: x + offsetX,
        top: y + offsetY,
        zIndex: 1000,
        pointerEvents: "none",
        maxWidth: 280,
        transform: "translateY(-100%)",
      }}
    >
      <div
        style={{
          background: "var(--color-dark-card)",
          border: "1px solid var(--color-dark-border)",
          borderRadius: 8,
          padding: "12px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: quadrantColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "var(--color-text)",
            }}
          >
            {entry.label}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: ringColor,
              background: `${ringColor}18`,
              border: `1px solid ${ringColor}40`,
              borderRadius: 4,
              padding: "2px 8px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {entry.ring}
          </span>
          {entry.status !== "no-change" && (
            <span
              style={{
                fontSize: 11,
                color: "var(--color-light-text)",
                border: "1px solid var(--color-dark-border)",
                borderRadius: 4,
                padding: "2px 8px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {STATUS_LABELS[entry.status]}
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--color-light-text)",
            lineHeight: 1.5,
          }}
        >
          {entry.description}
        </p>

        {entry.since && (
          <p
            style={{
              fontSize: 11,
              color: "var(--color-dark-border)",
              marginTop: 6,
              fontFamily: "var(--font-mono)",
            }}
          >
            Since {entry.since}
          </p>
        )}
      </div>
    </div>
  );
}
