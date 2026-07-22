import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getShowById } from "@/apis";
import screenImg from "@/assets/screen.png";
import { useSeat } from "@/context/SeatContext";
import { socket } from "@/utils/socket";

import SeatHeader from "@/components/seat-layout/SeatHeader";
import SeatFooter from "@/components/seat-layout/SeatFooter";

interface ISeatProps {
  seat: { status: string; number: string };
  row: number;
  selectedSeats?: any[];
  lockedSeats?: any[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Seat: React.FC<ISeatProps> = ({
  seat,
  row,
  selectedSeats,
  lockedSeats,
  onClick,
}) => {
  const seatId = `${row}${seat.number}`;
  const isLocked = lockedSeats?.includes(seatId);
  const isSelected = selectedSeats?.includes(seatId);

  return (
    <button
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm
        ${
          seat.status === "occupied"
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : isLocked
              ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
              : isSelected
                ? "bg-[#6e52fa] text-white border-[#cec4f7] border-3 cursor-pointer"
                : "hover:bg-gray-100 border-black cursor-pointer"
        }`}
      disabled={seat.status === "occupied" || isLocked}
      onClick={onClick}
    >
      {seat.status === "occupied" || isLocked ? "X" : seat.number}
    </button>
  );
};

const SeatLayout = () => {
  const { selectedSeats, setSelectedSeats, setSelectedShow } = useSeat();

  const handleSelectSeat = (row: any, number: any) => {
    const seatId = `${row}${number}`;
    setSelectedSeats((prev: any[]) =>
      prev.includes(seatId)
        ? prev.filter((eid) => eid !== seatId)
        : [...prev, seatId],
    );
  };

  const { showId } = useParams();

  const {
    data: showData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId!),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  useEffect(() => {
    setSelectedShow(showData);
    socket.connect();
    socket.on("connect", () => {
      console.log("🟢 Client connected to server! ID:", socket.id);
    });
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, [showData]);

  return (
    <>
      <div className="h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 w-full z-10">
          <SeatHeader showData={showData} />
        </div>
        {/* Scrollable seat layout */}
        <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
          <div className="flex flex-col items-center justify-center">
            {showData?.seatLayout && (
              <div className="flex flex-col items-center justify-center">
                {Object.entries(
                  showData.seatLayout.reduce((acc: any, curr: any) => {
                    if (!acc[curr.type])
                      acc[curr.type] = { price: curr.price, rows: [] };
                    acc[curr.type].rows.push(curr);
                    return acc;
                  }, {}),
                ).map(([type, { price, rows }]: any) => (
                  <div
                    key={type}
                    className="mb-12 w-full flex flex-col items-center justify-center"
                  >
                    <h2 className="text-center font-semibold text-lg mb-4">
                      {type} : ₹{price}
                    </h2>
                    <div className="space-y-2">
                      {rows.map((rowObj: any) => (
                        <div key={rowObj.row} className="flex items-center">
                          <div className="w-6 text-right mr-2 text-sm text-gray-600">
                            {rowObj.row}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {rowObj.seats.map((seat: any, i: number) => (
                              <Seat
                                key={i}
                                seat={seat}
                                row={rowObj.row}
                                selectedSeats={selectedSeats}
                                // lockedSeats={lockedSeats}
                                onClick={() =>
                                  handleSelectSeat(rowObj.row, seat.number)
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-5">
              <img
                src={screenImg} // or "/screen.png" if in public
                alt="Screen"
                className="w-[300px] md:w-[400px] object-contain opacity-80"
              />
            </div>
          </div>
        </div>
        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white border-t border-gray-200 py-4 px-4 z-10">
          <SeatFooter />
        </div>
      </div>
    </>
  );
};

export default SeatLayout;
