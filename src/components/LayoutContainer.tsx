import React from "react";

const LayoutContainer = ({ render }) => {
  return <div style={{ padding: "calc(100vw / 50)" }}>{render}</div>;
};

export default LayoutContainer;
