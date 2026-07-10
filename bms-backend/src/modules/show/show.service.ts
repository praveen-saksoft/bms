import { Types } from "mongoose";
import { generateSeatLayout, groupShowsByTheatreAndMovie } from "../../utils";
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

  const shows = await ShowModel.find(query)
    .populate("movie theater")
    .sort({ startTime: 1 });

  const groupedShows = groupShowsByTheatreAndMovie(shows);

  return groupedShows;
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
