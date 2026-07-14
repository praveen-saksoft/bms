import React from "react";

const SeatFooter = () => {
  const isSelected = true;

  return (
    <>
      {isSelected ? (
        <div className="bg-white py-3 px-6 flex items-center justify-between z-10">
          <p className="text-gray-700 font-medium text-base">2 Selected</p>
          <button className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg font-semibold">
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
