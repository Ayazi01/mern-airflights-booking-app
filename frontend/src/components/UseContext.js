import { useState, useEffect, useContext, createContext } from "react";
import SeatSelect from "./SeatSelect";

export const ResContext = createContext(null);
export const ResProvider = ({ children }) => {
  const [currentReservation, setCurrentReservation] = useState({});
  return (
    <ResContext.Provider
      value={{
        currentReservation,
        setCurrentReservation
      }}
    >
      {children}
    </ResContext.Provider>
  );
};