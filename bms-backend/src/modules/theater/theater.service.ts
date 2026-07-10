import type { ITheater } from "./theater.interface";
import { TheaterModel } from "./theater.model";

// create theater service
export const createTheaterService = async (
  theater: ITheater,
): Promise<ITheater> => {
  return await TheaterModel.create(theater);
};
// get all theaters service
export const getAllTheatersService = async (): Promise<ITheater[]> => {
  return await TheaterModel.find();
};
// get theater by id service
export const getTheaterByIdService = async (
  id: string,
): Promise<ITheater | null> => {
  return await TheaterModel.findById(id);
};
// get theater by state service
export const getTheatersByStateService = async (
  state: string,
): Promise<ITheater[]> => {
  return await TheaterModel.find({ state: { $regex: state, $options: "i" } });
};
