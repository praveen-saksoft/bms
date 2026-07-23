import React, { useEffect, useLayoutEffect, useState } from "react";
import dayjs from "dayjs";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import toast from "react-hot-toast";

import { calculateTotalPrice, groupSeatsByType } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useSeat } from "@/context/SeatContext";
import { useLiveLocation } from "@/context/LocationContext";

import SeatHeader from "@/components/seat-layout/SeatHeader";
import FullScreenLoader from "@/components/shared/FullScreenLoader";
import { useNavigate } from "react-router-dom";
import { useCountDown } from "@/hooks/useCountDown";
import { razorPayScript } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { createOrderRazorpay, verifyPaymentRazorpay } from "@/apis";

function loadScript() {
  return new Promise<boolean>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = razorPayScript;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = (error) => {
      reject(error);
    };

    document.body.appendChild(script);
  });
}

const Checkout = () => {
  const { user, toggleModal, socket } = useAuth();

  if (!user.email || !user.mobile) {
    toggleModal();
    return;
  }

  const [loaderMessage, setLoaderMessage] = useState("");

  const { location } = useLiveLocation();
  const { selectedSeats, selectedShow } = useSeat();
  const { displayTime, isExpired } = useCountDown({
    initialTimeInSeconds: 5 * 60,
    expiryCondition: 1,
  });

  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (!selectedShow || !selectedSeats.length) {
      navigate(-1);
    }
  }, []);
  //
  const { base, tax, total } = calculateTotalPrice(selectedSeats);

  useEffect(() => {
    if (isExpired) {
      socket?.emit("unlock-seats", {
        showId: selectedShow?._id,
        userId: user?._id,
        seatIds: selectedSeats,
      });

      toast.error("Time expired");
      navigate(-1);
    }
  }, [isExpired]);

  /** Payment Gateway Integration Start */
  const verifyPaymentMutation = useMutation({
    mutationFn: (reqData: any) => verifyPaymentRazorpay(reqData),
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      navigate(`/profile/${user?._id}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (reqData: any) => createOrderRazorpay(reqData),
    onSuccess: (res) => {
      const orderData = res?.data;

      const options = {
        name: "BookMyScreen",
        description: "Secure Payment for Your Booking",
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: orderData?.amount,
        currency: orderData?.currency,
        order_id: orderData?.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.mobile,
        },
        theme: { color: "#025cca" },
        handler: async function (res: any) {
          verifyPaymentMutation.mutate(res);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleBookSeat = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoaderMessage("Redirection to payment gateway, Hang on!!");
    try {
      const res = await loadScript();

      if (res) {
        const reqData = {
          amount: total,
        };
        createOrderMutation.mutate(reqData);
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    } finally {
      setLoaderMessage("");
    }
  };
  /** Payment Gateway Integration End */

  return (
    <div className="min-h-screen w-full bg-white">
      {!!loaderMessage && <FullScreenLoader message={loaderMessage} />}
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
              <div className="ml-auto mt-1">
                <p className="text-sm text-[#f74656] font-bold flex items-center justify-center border border-dashed rounded-md py-2 min-w-[150px]">
                  Time Left: {displayTime}
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

            <div
              onClick={handleBookSeat}
              className="flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer hover:shadow-2xl hover:shadow-red-300 hover:scale-x-105 transition ease-in-out"
            >
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
