import React, { useLayoutEffect } from "react";
import dayjs from "dayjs";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiCircleQuestion, CiUser } from "react-icons/ci";

import { calculateTotalPrice, groupSeatsByType } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useSeat } from "@/context/SeatContext";
import { useLiveLocation } from "@/context/LocationContext";

import SeatHeader from "@/components/seat-layout/SeatHeader";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user, toggleModal } = useAuth();

  if (!user.email || !user.mobile) {
    toggleModal();
    return;
  }

  const { location } = useLiveLocation();
  const { selectedSeats, selectedShow } = useSeat();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!selectedShow || !selectedSeats.length) {
      navigate(-1);
    }
  }, []);

  const { base, tax, total } = calculateTotalPrice(selectedSeats);

  return (
    <div className="min-h-screen w-full bg-white">
      <SeatHeader type="checkout" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={selectedShow?.movie?.posterUrl}
                alt={selectedShow?.movie?.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedShow?.movie?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedShow?.movie?.certification} •{" "}
                  {selectedShow?.movie?.languages?.join(", ")} •{" "}
                  {selectedShow?.movie?.format?.join(", ")}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedShow?.theater?.name}, {selectedShow?.theater?.city},{" "}
                  {selectedShow?.theater?.state}
                </p>
              </div>
            </div>
            {/* Showtime Details */}
            <div className="border border-gray-200 rounded-[24px] px-4 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(selectedShow?.date, "DD-MM-YYYY").format("D MMM")}&nbsp;•{" "}
                <span className="font-semibold">{selectedShow?.startTime}</span>
              </p>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats?.length} tickets
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {groupSeatsByType(selectedSeats).map(
                        ({ type, seats }) => (
                          <p key={type}>
                            {type} - {seats?.join(", ")}
                          </p>
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-md font-semibold mt-2">
                  <span className="text-gray-700">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-white rounded-[24px] px-6 py-5 border text-yellow-800 text-sm tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} /> No cancellation or refund available
                after payment.
              </span>
            </div>

            {/* Offers */}
            <div className="flex items-center justify-between border rounded-[24px] border-gray-200 px-6 py-5">
              <p className="font-medium text-sm flex items-center gap-2">
                <BiSolidOffer size={20} /> Available Offers
              </p>
              <p className="text-sm text-center text-blue-600 font-medium cursor-pointer">
                View all offers
              </p>
            </div>
          </div>
          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>
            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹{base}</span>
              </div>
              <div className="flex justify-between text-md pb-4">
                <span className="text-sm font-semibold">Taxes & Fees (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-md pt-4 font-semibold border-t border-gray-200">
                <span>To be paid</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* User details */}
            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">+91-{user?.mobile}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>

            <div className="flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer hover:shadow-2xl hover:shadow-red-300 hover:scale-x-105 transition ease-in-out">
              <p className="text-white font-bold">
                ₹{total} <span className="text-xs font-medium">TOTAL</span>
              </p>
              <p className="text-white font-medium">Proceed To Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
