import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "lucide-react";
import MovieCard from "../../components/user/MovieCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectWatchlistMovies,
  selectWatchlistLoading,
  selectWatchlistError,
  fetchWatchlist,
  type WatchlistMovie, // Import the type from Redux slice
} from "../../redux/slice/watchlist";

const Watchlist: React.FC = () => {
  const [filteredMovies, setFilteredMovies] = useState<WatchlistMovie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get data from Redux store
  const movies = useAppSelector(selectWatchlistMovies);
  const loading = useAppSelector(selectWatchlistLoading);
  const error = useAppSelector(selectWatchlistError);

  useEffect(() => {
    // Fetch watchlisted movies when component mounts
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre]);

  const filterMovies = (): void => {
    let filtered = [...movies]; // Create a copy of the movies array

    // Filter by search term (title only since director might not be available)
    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
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

  // Get all unique genres for filter dropdown
  const getAllGenres = (): string[] => {
    const allGenres = movies.flatMap((movie) => movie.genres);
    return [...new Set(allGenres)].sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your watchlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
              <p className="text-gray-600 mt-1">
                Your personal collection of {movies.length} watchlisted movies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Genre Filter */}
          <div className="sm:w-64 relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {movies.length === 0
                ? "Your watchlist is empty"
                : "No movies found"}
            </h3>
            <p className="text-gray-500">
              {movies.length === 0
                ? "Start adding movies to your watchlist to see them here."
                : "Try adjusting your search or filter criteria."}
            </p>
            {(searchTerm || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("");
                }}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
            {movies.length === 0 && (
              <button
                onClick={() => navigate("/movies")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Movies
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredMovies.length} of {movies.length} movies
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredMovies.map((movie) => {
                // Transform the movie data to match MovieCard expectations
                const movieForCard = {
                  ...movie,
                  director: "Unknown Director", // Add missing director field
                  averageRating: movie.averageRating ?? null, // Ensure consistent null handling
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
          </>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
