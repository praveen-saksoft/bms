import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import BannerSlider from "@/components/shared/BannerSlider";
import MovieFilters from "@/components/movie/MovieFilters";
import MovieList from "@/components/movie/MovieList";
import { getAllMovies } from "@/apis";

const Movies = () => {
  const { data: allMovies, isError } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => await getAllMovies(),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });

  if (isError) {
    console.log("Something went wrong");
  }

  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
        <MovieFilters />
        <MovieList allMovies={allMovies} />
      </div>
    </div>
  );
};

export default Movies;
