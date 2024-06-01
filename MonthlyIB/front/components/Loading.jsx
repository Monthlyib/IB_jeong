import { SyncLoader } from "react-spinners";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "50vh auto",
        alignItems: "center",
        justifyContent: "center",
        color: "#51346c",
      }}
    >
      <h3> Loading...</h3>
      <SyncLoader />
    </div>
  );
};

export default Loading;
