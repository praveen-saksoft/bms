import type { Request, Response, NextFunction } from "express";
import * as MovieService from "./movie.service";

export const createMovie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await MovieService.createMovieService(req.body);
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movies = await MovieService.getAllMoviesService();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const movie = await MovieService.getMovieByIdService(req.params.id);
    if (!movie) {
      next(new Error("Movie not found", { cause: { statusCode: 404 } }));
      return;
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const getTopRecommendedMovies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topMovies = await MovieService.getTopMoviesByVotesService(5);
    res.status(200).json(topMovies);
  } catch (error) {
    next(error);
  }
};
