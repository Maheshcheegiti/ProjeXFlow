import React, { createContext, useContext, useState } from "react";

// Create a context to hold the wsname value
const WsnameContext = createContext();

// Create a context provider component
export const WsnameProvider = ({ children }) => {
  const [wsname, setWsname] = useState(""); // Set the initial wsname value

  // Function to update wsname
  const updateWsname = (newWsname) => {
    setWsname(newWsname);
  };

  return (
    <WsnameContext.Provider value={{ wsname, updateWsname }}>
      {children}
    </WsnameContext.Provider>
  );
};

// Custom hook to access the wsname and updateWsname function
export const useWsname = () => {
  const context = useContext(WsnameContext);
  if (!context) {
    throw new Error("useWsname must be used within a WsnameProvider");
  }
  return context;
};
