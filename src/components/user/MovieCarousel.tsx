import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import type { Movie } from "../../types/movie.types";

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  onMovieClick: (movieId: string) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  title,
  onMovieClick,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemsToShow, setItemsToShow] = React.useState(5);

  // Responsive items to show
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else if (window.innerWidth < 1280) {
        setItemsToShow(4);
      } else {
        setItemsToShow(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= movies.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, movies.length - itemsToShow) : prevIndex - 1
    );
  };

  if (movies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <p className="text-gray-400 text-center py-8">No movies available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        
        {movies.length > itemsToShow && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick(movie.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {movies.length > itemsToShow && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from(
              { length: Math.ceil(movies.length / itemsToShow) },
              (_, i) => i
            ).map((dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setCurrentIndex(dotIndex * itemsToShow)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex >= dotIndex * itemsToShow &&
                  currentIndex < (dotIndex + 1) * itemsToShow
                    ? "bg-blue-500"
                    : "bg-gray-600"
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCarousel;