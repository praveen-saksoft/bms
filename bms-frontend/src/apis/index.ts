import { axiosWrapper } from "./axiosWrapper";

// List all the endpoints
export const getRecommendedMovies = () =>
  axiosWrapper.get("/movies/recommended");

export const getAllMovies = () => axiosWrapper.get("/movies");

export const getMovieById = (id: string) => axiosWrapper.get(`/movies/${id}`);

export const getShowsByMovieAndLocation = (
  movieId: string,
  state: string,
  date: string,
) =>
  axiosWrapper.get("/shows", {
    params: {
      movieId,
      state,
      date,
    },
  });

export const getShowById = (id: string) => axiosWrapper.get(`/shows/${id}`);
