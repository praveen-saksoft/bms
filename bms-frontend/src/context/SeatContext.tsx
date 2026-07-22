import React, { createContext, useContext, useState } from "react";

interface ISeatContext {
  selectedSeats: any;
  setSelectedSeats: React.Dispatch<React.SetStateAction<any>>;
  selectedShow: any;
  setSelectedShow: React.Dispatch<React.SetStateAction<any>>;
}

const SeatContext = createContext<ISeatContext | null>(null);

export const SeatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  return (
    <SeatContext.Provider
      value={{ selectedSeats, setSelectedSeats, selectedShow, setSelectedShow }}
    >
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => {
  const context = useContext(SeatContext);
  if (context == null) {
    throw new Error("useSeat must be used within a SeatContextProvider");
  }
  return context;
};
