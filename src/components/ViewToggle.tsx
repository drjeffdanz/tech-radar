interface ViewToggleProps {
  view: "chart" | "list";
  onChange: (view: "chart" | "list") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  const baseStyle: React.CSSProperties = {
    padding: "6px 20px",
    fontSize: 13,
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    border: "1px solid var(--color-dark-border)",
    transition: "all 0.2s",
    cursor: "pointer",
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    background: "var(--color-gold)",
    color: "#0a0a0a",
    borderColor: "var(--color-gold)",
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    background: "transparent",
    color: "var(--color-light-text)",
  };

  return (
    <div
      role="group"
      aria-label="View toggle"
      style={{ display: "flex", gap: 0 }}
    >
      <button
        style={{
          ...(view === "chart" ? activeStyle : inactiveStyle),
          borderRadius: "6px 0 0 6px",
          borderRight: view === "chart" ? undefined : "none",
        }}
        onClick={() => onChange("chart")}
        aria-pressed={view === "chart"}
      >
        Radar Chart
      </button>
      <button
        style={{
          ...(view === "list" ? activeStyle : inactiveStyle),
          borderRadius: "0 6px 6px 0",
          borderLeft: view === "list" ? undefined : "none",
        }}
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
      >
        List View
      </button>
    </div>
  );
}
