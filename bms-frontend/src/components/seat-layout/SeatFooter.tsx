import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSeat } from "@/context/SeatContext";
import { useLiveLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext";

const SeatFooter = () => {
  const { selectedSeats } = useSeat();
  const { location } = useLiveLocation();
  const { user, socket } = useAuth();

  const navigate = useNavigate();
  const { showId } = useParams();

  const handleNavigateToCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket?.emit("lock-seats", {
      showId,
      seatIds: selectedSeats,
      userId: user._id,
    });
    navigate(`/shows/${showId}/${location}/checkout`);
  };

  return (
    <>
      {!!selectedSeats?.length ? (
        <div className="bg-white py-3 px-6 flex items-center justify-between z-10">
          <p className="text-gray-700 font-medium text-base">
            {selectedSeats?.length} Selected
          </p>
          <button
            onClick={handleNavigateToCheckout}
            className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg font-semibold"
          >
            Proceed
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-xs font-bold text-purple-600 tracking-wider">
            SCREEN THIS WAY
          </p>
          <div className="flex gap-4 text-xs mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-[4px] border"></div>
              <p>Available</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-[4px] border flex items-center justify-center">
                <small className="leading-none">x</small>
              </div>
              <p>Occupied</p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-[4px] bg-purple-600"></div>
              <p>Selected</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeatFooter;
