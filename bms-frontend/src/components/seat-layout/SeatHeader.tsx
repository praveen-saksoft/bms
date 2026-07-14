import React from "react";
import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import mainLogo from "@/assets/main-icon.png";
import { useNavigate } from "react-router-dom";

interface ISeatHeaderProps {
  showData: any;
}

const SeatHeader: React.FC<ISeatHeaderProps> = ({ showData }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="border-b border-gray-200 shadow-sm bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <img
            className="h-6 md:h-8 object-contain cursor-pointer"
            src={mainLogo}
            alt="bookMyScreen"
            onClick={() => navigate("/")}
          />

          <div className="text-center">
            <h2 className="font-bold text-lg md:text-xl">
              {showData?.movie?.title}
            </h2>

            <p className="text-xs text-gray-500 font-semibold">
              {dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM YYYY")}
              {" | "}
              {showData?.startTime} at{" | "}
              {showData?.theater?.name +
                ", " +
                showData?.theater?.city +
                ", " +
                showData?.theater?.state}
            </p>
          </div>

          <button className="bg-[#f84464] cursor-pointer text-white px-4 py-1.5 rounded text-sm">
            Sign in
          </button>
        </div>
      </div>
      {/* Show Timings */}
      <div className="bg-white pt-4">
        <div className="mx-auto px-6 pb-4 flex items-center gap-4 max-w-7xl">
          <div className="text-sm text-gray-700">
            <p className="font-medium text-gray-500 text-xs">
              {dayjs(showData?.date, "DD-MM-YYYY").format("ddd")}
            </p>
            <p className="font-semibold text-gray-700 text-sm">
              {dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM")}
            </p>
          </div>
          <button
            className={`border cursor-pointer rounded-[14px] px-8 py-3 text-sm border-black font-medium bg-gray-200`}
          >
            {showData?.startTime}
            <p className="text-[10px] text-gray-500 -mt-1">
              {showData?.audioType?.toUpperCase()}
            </p>
          </button>
        </div>
      </div>
      <hr className="my-2 border-gray-300 max-w-7xl mx-auto" />
    </>
  );
};

export default SeatHeader;
