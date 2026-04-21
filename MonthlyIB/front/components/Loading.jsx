import { SyncLoader } from "react-spinners";

const Loading = ({ variant = "page", label = "Loading...", className = "" }) => {
  const isInline = variant === "inline";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#51346c",
        margin: isInline ? "0 auto" : "50vh auto",
        minHeight: isInline ? "100%" : "auto",
        width: "100%",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: isInline ? "1.5rem" : "1.8rem",
          fontWeight: 700,
        }}
      >
        {label}
      </h3>
      <div style={{ marginTop: "1rem" }}>
        <SyncLoader color="#51346c" size={isInline ? 10 : 12} margin={6} />
      </div>
    </div>
  );
};

export default Loading;
