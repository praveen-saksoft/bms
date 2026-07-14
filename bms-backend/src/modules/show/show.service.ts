import { Types } from "mongoose";
import { generateSeatLayout } from "../../utils";
import type { IShow, TSeatStatus } from "./show.interface";
import { ShowModel } from "./show.model";

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
      $sort: { startTime: 1 },
    },
    {
      $group: {
        _id: "$theaterDetails._id",
        theater: { $first: "$theaterDetails" },
        movie: { $first: "$movie" },
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
  showId: string,
  row: string,
  seatNumber: number,
  status: TSeatStatus,
) => {
  return await ShowModel.updateOne(
    { _id: new Types.ObjectId(showId), "seatLayout.row": row },
    { $set: { "seatLayout.$.seats.$[seat].status": status } },
    { arrayFilters: [{ "seat.number": seatNumber }] },
  );
};
