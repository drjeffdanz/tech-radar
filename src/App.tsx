import { useEffect, useState } from "react";
import type { RadarData } from "./types";
import { FALLBACK_DATA } from "./data/fallback";
import { RadarChart } from "./components/RadarChart";
import { ListView } from "./components/ListView";
import { ViewToggle } from "./components/ViewToggle";
import { Legend } from "./components/Legend";

const RADAR_JSON_URL =
  "https://raw.githubusercontent.com/drjeffdanz/tech-radar/main/public/radar.json";

export default function App() {
  const [data, setData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"chart" | "list">("chart");

  useEffect(() => {
    fetch(RADAR_JSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RadarData>;
      })
      .then(setData)
      .catch(() => {
        setData(FALLBACK_DATA);
        setError("Live data unavailable — showing cached snapshot.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-dark)",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--color-dark-border)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: "var(--color-text)" }}>DR. JEFF </span>
            <span style={{ color: "var(--color-gold)" }}>DANIELS</span>
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-light-text)",
              fontFamily: "var(--font-mono)",
              marginTop: 2,
            }}
          >
            {data ? `Technology Radar · ${data.version} · Updated ${data.updated}` : "Technology Radar"}
          </p>
        </div>

        <ViewToggle view={view} onChange={setView} />
      </header>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          style={{
            padding: "8px 24px",
            background: "#2a1a0a",
            borderBottom: "1px solid #c8956c30",
            fontSize: 12,
            color: "var(--color-gold)",
            fontFamily: "var(--font-mono)",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "20px 24px",
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              color: "var(--color-light-text)",
              fontSize: 14,
              fontFamily: "var(--font-mono)",
            }}
          >
            Loading radar data...
          </div>
        ) : data ? (
          <>
            <Legend />
            <div style={{ marginTop: 16 }}>
              {view === "chart" ? (
                <RadarChart entries={data.entries} />
              ) : (
                <ListView entries={data.entries} />
              )}
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-dark-border)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 11, color: "var(--color-light-text)", fontFamily: "var(--font-mono)" }}>
          © {new Date().getFullYear()} Dr. Jeff Daniels
        </p>
        <a
          href="https://www.drjeffdaniels.com"
          style={{ fontSize: 11, color: "var(--color-gold)", fontFamily: "var(--font-mono)" }}
        >
          drjeffdaniels.com
        </a>
      </footer>
    </div>
  );
}
