import React from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "@/apis";
import { useLiveLocation } from "@/context/LocationContext";

const Recommended = () => {
  const navigate = useNavigate();
  const { location } = useLiveLocation();

  const handleNavigate = (movie: any) => {
    const originalTitle = movie.title;
    const sanitizedTitle = originalTitle.replace(/(:|-)/g, "");
    const formattedTitle = sanitizedTitle.replace(/\s+/g, "-").toLowerCase();

    navigate(`/movies/${location}/${formattedTitle}/${movie._id}/ticket`);
  };
  // API CALL
  const { data: recMovies, isError } = useQuery({
    queryKey: ["recommendedMovies"],
    queryFn: async () => {
      return await getRecommendedMovies();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    console.log("Something went wrong");
  }

  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Recommended Movies</h2>
          <span className="text-md text-red-500 cursor-pointer hover:underline font-medium">
            See All
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recMovies?.data?.map((movie: any) => (
            <div
              key={movie._id}
              onClick={() => handleNavigate(movie)}
              className="rounded overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={movie.posterUrl}
                  alt={`movie.title`}
                  className="w-full h-[300px] object-cover rounded"
                />
                <div className="absolute w-full bottom-0 rounded-b bg-black text-white text-sm px-2 py-1 flex items-center justify-between">
                  <span>⭐ {movie.rating}/10</span>
                  <span>{movie.votes} Votes</span>
                </div>
              </div>
              <div className="px-2 py-1">
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <p className="text-md text-gray-500">
                  {movie.genre?.join(" | ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
