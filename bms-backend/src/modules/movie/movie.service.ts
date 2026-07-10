import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";

// create movie service
export const createMovieService = async (movie: IMovie): Promise<IMovie> => {
  return await MovieModel.create(movie);
};

// get all movies service
export const getAllMoviesService = async (): Promise<IMovie[]> => {
  return await MovieModel.find().sort({ releaseDate: -1 });
};

// get movie by id service
export const getMovieByIdService = async (
  id: string,
): Promise<IMovie | null> => {
  return await MovieModel.findById(id);
};

// get top movie by votes
export const getTopMoviesByVotesService = async (
  limit: number,
): Promise<IMovie[]> => {
  return await MovieModel.find().sort({ votes: -1 }).limit(limit);
};
