import { RINGS, QUADRANTS, RING_COLORS, QUADRANT_COLORS } from "../utils/radar-math";

const STATUS_LEGEND = [
  { shape: "circle", label: "No change" },
  { shape: "triangle-up", label: "New / Moved in" },
  { shape: "triangle-down", label: "Moved out" },
];

function ShapeIcon({ shape }: { shape: string }) {
  const size = 16;
  if (shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        <circle cx={8} cy={8} r={5} fill="var(--color-light-text)" />
      </svg>
    );
  }
  if (shape === "triangle-up") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16">
        <polygon points="8,3 3,13 13,13" fill="var(--color-light-text)" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <polygon points="8,13 3,3 13,3" fill="var(--color-light-text)" />
    </svg>
  );
}

export function Legend() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        padding: "16px 0",
        borderTop: "1px solid var(--color-dark-border)",
        borderBottom: "1px solid var(--color-dark-border)",
        margin: "0 0 8px",
      }}
    >
      {/* Rings */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--color-light-text)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Rings
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {RINGS.map((ring) => (
            <div key={ring} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: RING_COLORS[ring],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--color-light-text)" }}>{ring}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quadrants */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--color-light-text)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Quadrants
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {QUADRANTS.map((q) => (
            <div key={q} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: QUADRANT_COLORS[q],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, color: "var(--color-light-text)" }}>{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status shapes */}
      <div>
        <p
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--color-light-text)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Status
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {STATUS_LEGEND.map(({ shape, label }) => (
            <div key={shape} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShapeIcon shape={shape} />
              <span style={{ fontSize: 12, color: "var(--color-light-text)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
