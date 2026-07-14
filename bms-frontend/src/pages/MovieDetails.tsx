import React from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { filters } from "@/utils/constants";
import { getMovieById } from "@/apis";

import TheaterTimings from "@/components/movie/TheaterTimings";

const MovieDetails: React.FC = () => {
  const { id: movieId } = useParams();
  const { data: movie, isError } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: async () => await getMovieById(movieId!),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      {/* MoviesDetails section */}
      <div
        className="relative text-white font-sans px-4 py-10"
        style={{
          backgroundImage: `url(${movie?.data?.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* overlay for darkness */}
        <div className="absolute inset-0 bg-black opacity-70"></div>
        {/* Actual Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <div>
            <img
              src={movie?.data?.posterUrl}
              alt={movie?.data?.title}
              className="rounded-xl w-52 shadow-xl"
            />
          </div>
          {/* Details */}
          <div className="flex flex-col justify-start flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie?.data?.title}</h1>

            <div className="flex items-center gap-4 mb-3">
              <div className="bg-[#3a3a3a] px-4 py-2 rounded-md flex items-center gap-2 text-sm">
                <span className="text-pink-500 font-bold">
                  ★ {movie?.data?.rating}
                </span>
                <span className="text-gray-300">
                  {movie?.data?.votes} Votes
                </span>
                <button className="cursor-pointer bg-[#2f2f2f] ml-6 px-4 py-2 rounded-md  hove:bg-[#4a4a4a]">
                  Rate now
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm mb-4">
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {movie?.data?.format.join(", ")}
              </span>
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {movie?.data?.languages.join(", ")}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              {movie?.data?.duration} • {movie?.data?.genre.join(", ")} •{" "}
              {movie?.data?.certification} •{" "}
              {dayjs(movie?.data?.releaseDate).format("DD MMM YYYY")}
            </p>

            <div>
              <h2 className="text-xl font-bold mb-2">About the movie</h2>
              <p className="text-sm text-gray-50 leading-relaxed mb-4">
                {movie?.data?.description}
              </p>
            </div>
          </div>
          {/* Share Button */}
          <div className="absolute top-0 right-0 cursor-pointer">
            <button
              className="cursor-pointer bg-[#3a3a3a] px-4 py-2 rounded
            text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.13-4.21c.05-.25.09-.51.09-.78s-.03-.53-.09-.78l7.04-4.15c.54.5 1.25.81 2.05.81 1.66 0 3-1.34 3-3S19.66 2 18 2s-3 1.34-3 3c0 .27.04.52.09.78L7.91 9.93C7.38 9.43 6.67 9.12 5.87 9.12 4.21 9.12 2.87 10.46 2.87 12.12s1.34 3 3 3c.8 0 1.51-.31 2.04-.81l7.13 4.21c-.06.24-.1.49-.1.75 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Show Timings */}
      <div className="max-w-7xl mx-auto mt-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {filters.map((filter, i) => (
            <button
              className="border border-gray-300 px-5 py-1 rounded-lg
                    cursor-pointer text-sm hover:bg-gray-100"
              key={i}
            >
              {filter}
            </button>
          ))}
        </div>

        <hr className="my-2 border-gray-200" />

        {/* Availability Status  */}
        <div className="flex items-center gap-4 rounded-s-sm mb-1 py-2 text-sm px-8 bg-gray-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 bg-black rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500">Available</small>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 bg-yellow-400 rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500">Filling fast</small>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 mr-1 bg-red-400 rounded-full inline-block"></span>
            <small className="font-semibold text-gray-500"> Almost full</small>
          </span>
        </div>

        {/* Theatres and Timings */}
        <TheaterTimings movieId={movieId!} />
      </div>
    </>
  );
};

export default MovieDetails;
