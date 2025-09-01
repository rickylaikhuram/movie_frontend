// Watchlist.tsx (Updated with dark theme and no search)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Heart } from "lucide-react";
import MovieCard from "../../components/user/MovieCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectWatchlistMovies,
  selectWatchlistLoading,
  selectWatchlistError,
  fetchWatchlist,
  type WatchlistMovie,
} from "../../redux/slice/watchlist";

const Watchlist: React.FC = () => {
  const [filteredMovies, setFilteredMovies] = useState<WatchlistMovie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const movies = useAppSelector(selectWatchlistMovies);
  const loading = useAppSelector(selectWatchlistLoading);
  const error = useAppSelector(selectWatchlistError);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    filterMovies();
  }, [movies, selectedGenre]);

  const filterMovies = (): void => {
    let filtered = [...movies];

    if (selectedGenre) {
      filtered = filtered.filter((movie) =>
        movie.genres.some(
          (genre) => genre.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    setFilteredMovies(filtered);
  };

  const handleMovieClick = (movieId: string): void => {
    navigate(`/movies/${movieId}`);
  };

  const handleRetry = (): void => {
    dispatch(fetchWatchlist());
  };

  const getAllGenres = (): string[] => {
    const allGenres = movies.flatMap((movie) => movie.genres);
    return [...new Set(allGenres)].sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-800 rounded-lg"></div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
            <p className="text-gray-400">
              Your personal collection of {movies.length} watchlisted movies
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Filter Movies</h3>
          
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Genres</option>
              {getAllGenres().map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <div className="text-sm text-gray-400">
          {filteredMovies.length === 0 && movies.length > 0 ? (
            "No movies found with selected filters"
          ) : (
            `Showing ${filteredMovies.length} of ${movies.length} movies`
          )}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <Heart size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {movies.length === 0
              ? "Your watchlist is empty"
              : "No movies found"}
          </h3>
          <p className="text-gray-400 mb-6">
            {movies.length === 0
              ? "Start adding movies to your watchlist to see them here."
              : "Try adjusting your filter criteria."}
          </p>
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre("")}
              className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors mr-4"
            >
              Clear filter
            </button>
          )}
          {movies.length === 0 && (
            <button
              onClick={() => navigate("/movies")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Movies
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => {
            const movieForCard = {
              ...movie,
              director: "Unknown Director",
              averageRating: movie.averageRating ?? null,
            };

            return (
              <MovieCard
                key={movie.id}
                movie={movieForCard}
                onClick={() => handleMovieClick(movie.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;