import React from "react";
import { MdChair } from "react-icons/md";
// import { ordersData } from "@/utils/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBookings } from "@/apis";
import dayjs from "dayjs";

const BookingHistory = () => {
  const {
    data: ordersData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <p className="text-gray-500">
          Failed to load bookings. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>

        {ordersData?.map((order: any, i: number) => (
          <React.Fragment key={order._id + "" + i}>
            <div className="bg-white p-5 rounded-md mb-2 overflow-hidden">
              <div className="flex items-start gap-10">
                <img
                  src={order.showId?.movie?.posterUrl}
                  alt={order.showId?.movie?.title}
                  className="w-30 h-40 object-cover rounded"
                />
                {/* divided with fixed height same as image */}
                <div className="h-40 border-l border-gray-300 border-dashed"></div>
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="font-normal text-lg">
                      {order.showId?.movie?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.showId?.movie?.format?.join("|")}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mt-2">
                      {dayjs(order.showId?.date, "DD-MM-YYYY").format(
                        "ddd, D MMM YYYY",
                      )}{" "}
                      | {order.showId?.startTime} -{" "}
                      {order.showId?.theater?.name}
                    </p>
                    <small className="text-gray-700 mt-1">
                      Quantity: {order.seats?.length}
                    </small>
                    <p className="text-md font-semibold text-gray-700 mt-2">
                      <MdChair className="inline items-center mr-2" size={24} />
                      {order.seats?.join(", ")}
                    </p>
                  </div>
                  <p>M-Ticket</p>
                </div>
              </div>
              <div className="p-4 text-right">
                <p className="text-sm text-gray-500">
                  Ticket: ₹{order.bookingFee?.ticketPrice?.toFixed(2)} +
                  Convenience Fees: ₹{order.bookingFee?.convenience?.toFixed(2)}
                </p>
                <p className="text-xl font-bold">
                  ₹{order.bookingFee?.total?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
              <div>
                <p className="font-semibold">Booking Date & Time</p>
                <p>
                  {dayjs(order.bookingDateTime).format("MMM DD YYYY hh:mmA")}
                </p>
              </div>
              <div>
                <p className="font-semibold">Payment Method</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div>
                <p className="font-semibold">Booking ID</p>
                <p>{order.bookingRef}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default BookingHistory;
