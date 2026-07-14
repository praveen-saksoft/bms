import React from "react";
import { useNavigate } from "react-router-dom";

import { useLiveLocation } from "@/context/LocationContext";

interface IMovieProps {
  movie: any;
}

const MovieCard: React.FC<IMovieProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { location } = useLiveLocation();

  const handleNavigate = (movie: any) => {
    const originalTitle = movie.title;
    const sanitizedTitle = originalTitle.replace(/(:|-)/g, "");
    const formattedTitle = sanitizedTitle.replace(/\s+/g, "-").toLowerCase();

    navigate(`/movies/${movie._id}/${formattedTitle}/${location}/shows`);
  };

  return (
    <div
      className="w-40 md:w-52 cursor-pointer"
      onClick={() => handleNavigate(movie)}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="rounded-lg shadow-md"
      />
      <p className="mt-2 font-medium">{movie.title}</p>
      <p className="text-xs text-gray-500">
        {movie.rating} | {movie.votes}
      </p>
      <p className="text-sm text-gray-600">{movie.certification}</p>
      <p className="text-sm text-gray-500 truncate">
        {movie.languages?.join(", ")}
      </p>
    </div>
  );
};

export default MovieCard;
