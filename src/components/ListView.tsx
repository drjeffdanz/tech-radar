import { useState } from "react";
import type { RadarEntry, Ring } from "../types";
import { RINGS, QUADRANTS, RING_COLORS, QUADRANT_COLORS } from "../utils/radar-math";

interface ListViewProps {
  entries: RadarEntry[];
}

const STATUS_LABELS: Record<string, string> = {
  new: "NEW",
  "moved-in": "↑ IN",
  "moved-out": "↓ OUT",
  "no-change": "—",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#9cc97e",
  "moved-in": "#7eb8c9",
  "moved-out": "#c97ea8",
  "no-change": "#3a3a3a",
};

function RingBadge({ ring }: { ring: Ring }) {
  const color = RING_COLORS[ring];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        padding: "2px 8px",
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {ring}
    </span>
  );
}

export function ListView({ entries }: ListViewProps) {
  const [ringFilter, setRingFilter] = useState<Ring | "All">("All");
  const [quadrantFilter, setQuadrantFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = entries.filter((e) => {
    if (ringFilter !== "All" && e.ring !== ringFilter) return false;
    if (quadrantFilter !== "All" && e.quadrant !== quadrantFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.label.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  // Group by quadrant
  const grouped = QUADRANTS.map((q) => ({
    quadrant: q,
    entries: filtered.filter((e) => e.quadrant === q),
  })).filter((g) => g.entries.length > 0);

  const filterButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    fontWeight: 500,
    border: "1px solid",
    borderColor: active ? "var(--color-gold)" : "var(--color-dark-border)",
    borderRadius: 4,
    background: active ? "var(--color-gold)" : "transparent",
    color: active ? "#0a0a0a" : "var(--color-light-text)",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Search */}
        <input
          type="search"
          placeholder="Search technologies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px",
            background: "var(--color-dark-card)",
            border: "1px solid var(--color-dark-border)",
            borderRadius: 6,
            color: "var(--color-text)",
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            outline: "none",
            width: "100%",
            maxWidth: 300,
          }}
        />

        {/* Ring filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--color-light-text)", fontFamily: "var(--font-mono)", marginRight: 4 }}>
            RING:
          </span>
          {(["All", ...RINGS] as (Ring | "All")[]).map((r) => (
            <button key={r} style={filterButtonStyle(ringFilter === r)} onClick={() => setRingFilter(r)}>
              {r}
            </button>
          ))}
        </div>

        {/* Quadrant filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--color-light-text)", fontFamily: "var(--font-mono)", marginRight: 4 }}>
            AREA:
          </span>
          <button style={filterButtonStyle(quadrantFilter === "All")} onClick={() => setQuadrantFilter("All")}>
            All
          </button>
          {QUADRANTS.map((q) => (
            <button key={q} style={filterButtonStyle(quadrantFilter === q)} onClick={() => setQuadrantFilter(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 12, color: "var(--color-light-text)", fontFamily: "var(--font-mono)" }}>
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>

      {/* Grouped entries */}
      {grouped.length === 0 ? (
        <p style={{ color: "var(--color-light-text)", fontSize: 14, padding: "32px 0", textAlign: "center" }}>
          No technologies match your filters.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {grouped.map(({ quadrant, entries: qEntries }) => (
            <div key={quadrant}>
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: QUADRANT_COLORS[quadrant],
                  fontFamily: "var(--font-mono)",
                  marginBottom: 10,
                  paddingBottom: 6,
                  borderBottom: `1px solid ${QUADRANT_COLORS[quadrant]}30`,
                }}
              >
                {quadrant}
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      {["Technology", "Ring", "Status", "Since", "Description"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "6px 12px",
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--color-light-text)",
                            borderBottom: "1px solid var(--color-dark-border)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {qEntries
                      .sort((a, b) => RINGS.indexOf(a.ring) - RINGS.indexOf(b.ring))
                      .map((entry, i) => (
                        <tr
                          key={entry.id}
                          style={{
                            background: i % 2 === 0 ? "transparent" : "var(--color-dark-card)",
                            transition: "background 0.15s",
                          }}
                        >
                          <td
                            style={{
                              padding: "8px 12px",
                              fontWeight: 500,
                              color: "var(--color-text)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.label}
                          </td>
                          <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                            <RingBadge ring={entry.ring} />
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontFamily: "var(--font-mono)",
                                color: STATUS_COLORS[entry.status],
                                fontWeight: 600,
                              }}
                            >
                              {STATUS_LABELS[entry.status]}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "8px 12px",
                              fontSize: 11,
                              fontFamily: "var(--font-mono)",
                              color: "var(--color-light-text)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.since ?? "—"}
                          </td>
                          <td
                            style={{
                              padding: "8px 12px",
                              color: "var(--color-light-text)",
                              lineHeight: 1.5,
                              minWidth: 200,
                            }}
                          >
                            {entry.description}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
