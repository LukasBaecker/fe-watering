import React, { useState, createContext } from "react";

export const StatusContext = createContext();

export const StatusProvider = (props) => {
  const [statusState, setStatusState] = useState("loading");

  return (
    <StatusContext.Provider value={[statusState, setStatusState]}>
      {props.children}
    </StatusContext.Provider>
  );
};
