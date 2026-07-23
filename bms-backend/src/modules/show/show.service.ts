import { ClientSession, Types } from "mongoose";
import { generateSeatLayout } from "../../utils";
import type { IShow, TSeatStatus } from "./show.interface";
import { ShowModel } from "./show.model";
import createHttpError from "http-errors";

// create show service
export const createShowService = async (showData: IShow) => {
  const seatLayout: any[] = generateSeatLayout();
  const showToCreate = {
    ...showData,
    seatLayout,
  };
  return await ShowModel.create(showToCreate);
};

// get shows by movie date and location
export const getShowsByMovieDateLocationService = async (
  movieId: string,
  date: string,
  location: string,
) => {
  const query: any = {
    movie: new Types.ObjectId(movieId),
    location: { $regex: new RegExp(location, "i") },
  };

  if (date) {
    query.date = date;
  }

  const shows = await ShowModel.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "theaters",
        localField: "theater",
        foreignField: "_id",
        as: "theaterDetails",
      },
    },
    {
      $unwind: "$theaterDetails",
    },
    {
      $lookup: {
        from: "movies",
        localField: "movie",
        foreignField: "_id",
        as: "movieDetails",
      },
    },
    { $unwind: "$movieDetails" },
    {
      $sort: { startTime: 1 },
    },
    {
      $group: {
        _id: "$theaterDetails._id",
        theater: { $first: "$theaterDetails" },
        movie: { $first: "$movieDetails" },
        shows: {
          $push: {
            _id: "$_id",
            date: "$date",
            startTime: "$startTime",
            format: "$format",
            audioType: "$audioType",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        movie: 1,
        theater: 1,
        shows: 1,
      },
    },
  ]);

  return shows;
};

// get show by id
export const getShowByIdService = async (showId: string) => {
  return await ShowModel.findById(showId).populate("movie theater");
};
// update seat status
export const updateSeatStatusService = async (
  showId: Types.ObjectId,
  seats: string[],
  status: TSeatStatus,
  session: ClientSession,
) => {
  const show = await ShowModel.findById(showId).session(session);

  if (!show) {
    throw createHttpError(404, "Show not found");
  }

  // parse each seat string like "A1" into row and number
  const parsedSeats = seats.map((seat) => {
    const row = seat.charAt(0);
    const number = parseInt(seat.slice(1));
    return { row, number, label: seat };
  });

  const seatLayout = show.seatLayout;

  for (const pSeat of parsedSeats) {
    // search the seatlayout array fow a row whose "row" field matches e.g. "A"
    // seatlayout = [{row: "A", seats: [..]},...]
    const row = seatLayout.find((r) => r.row === pSeat.row);

    if (!row) {
      throw createHttpError(400, `Invalid seat: ${pSeat.label}`);
    }

    const seat = row.seats.find((s) => s.number === pSeat.number);
    if (!seat) {
      throw createHttpError(400, `Invalid seat: ${pSeat.label}`);
    }

    if (status === "BOOKED" && seat.status === "BOOKED") {
      throw createHttpError(400, `Seat ${pSeat.label} is already booked!`);
    }

    seat.status = status;
  }

  show.markModified("seatLayout");
  await show.save({ session });
};
