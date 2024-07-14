import React from "react";
import Header from "./_component/Header";

const Provider = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="mt-32">{children}</div>
    </div>
  );
};

export default Provider;
