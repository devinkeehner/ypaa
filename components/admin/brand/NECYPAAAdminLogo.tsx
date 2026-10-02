import NECYPAAAdminIcon from "./NECYPAAAdminIcon";

export default function NECYPAAAdminLogo() {
  return (
    <span
      aria-label="NECYPAA XXXVI"
      style={{
        alignItems: "center",
        color: "var(--theme-text)",
        display: "inline-flex",
        gap: 10,
        minWidth: 0,
      }}
    >
      <NECYPAAAdminIcon />
      <span
        style={{
          display: "grid",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        NECYPAA
        <small
          style={{
            color: "#E85E27",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.14em",
            marginTop: 3,
          }}
        >
          XXXVI
        </small>
      </span>
    </span>
  );
}
