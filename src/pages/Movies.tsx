import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "../utils/axios";
import MovieCard from "../components/user/MovieCard";
import FilterOptions from "../components/user/movie/FilterOptions";
import ActiveFilters from "../components/user/movie/ActiveFilters";
import Pagination from "../components/user/movie/Pagination";
import type { Movie, MoviesApiResponse } from "../types/movie.types";

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pagination and filters state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMovies, setTotalMovies] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [movieType, setMovieType] = useState<string>("");

  useEffect(() => {
    // Initialize state from URL params
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const year = searchParams.get("year") || "";
    const sort = searchParams.get("sort") || "latest";
    const type = searchParams.get("type") || "";

    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedGenre(genre);
    setSelectedYear(year);
    setSortBy(sort);
    setMovieType(type);
  }, [searchParams]);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, searchTerm, selectedGenre, selectedYear, sortBy, movieType]);

  const fetchMovies = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", currentPage.toString());

      if (searchTerm) params.set("search", searchTerm);
      if (selectedGenre) params.set("genre", selectedGenre);
      if (selectedYear) params.set("year", selectedYear);
      if (sortBy) params.set("sort", sortBy);
      if (movieType) params.set("type", movieType);

      const response = await instance.get<MoviesApiResponse>(
        `/api/movies?${params.toString()}`
      );

      setMovies(response.data.movies);
      setTotalPages(response.data.totalPages);
      setTotalMovies(response.data.totalMovies);

      // Update URL params
      updateURLParams();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch movies";
      setError(errorMessage);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateURLParams = () => {
    const params = new URLSearchParams();

    if (currentPage > 1) params.set("page", currentPage.toString());
    if (searchTerm) params.set("search", searchTerm);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (selectedYear) params.set("year", selectedYear);
    if (sortBy !== "latest") params.set("sort", sortBy);
    if (movieType) params.set("type", movieType);

    setSearchParams(params);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchMovies();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedYear("");
    setSortBy("latest");
    setMovieType("");
    setCurrentPage(1);
    navigate('/movies'); // Clear URL params
  };

  const handleMovieClick = (movieId: string): void => {
    navigate(`/movies/${movieId}`);
  };

  // Individual filter remove handlers
  const removeSearch = () => {
    setSearchTerm("");
    handleFilterChange();
  };

  const removeGenre = () => {
    setSelectedGenre("");
    handleFilterChange();
  };

  const removeYear = () => {
    setSelectedYear("");
    handleFilterChange();
  };

  const removeSort = () => {
    setSortBy("latest");
    handleFilterChange();
  };

  const removeType = () => {
    setMovieType("");
    handleFilterChange();
  };

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-300">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={fetchMovies}
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
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Movies</h1>
              <p className="text-gray-400 mt-1">
                Discover and explore our collection of movies
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Section */}
        <FilterOptions
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sortBy={sortBy}
          setSortBy={setSortBy}
          movieType={movieType}
          setMovieType={setMovieType}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
        />

        {/* Active Filters */}
        <ActiveFilters
          searchTerm={searchTerm}
          selectedGenre={selectedGenre}
          selectedYear={selectedYear}
          sortBy={sortBy}
          movieType={movieType}
          onRemoveSearch={removeSearch}
          onRemoveGenre={removeGenre}
          onRemoveYear={removeYear}
          onRemoveSort={removeSort}
          onRemoveType={removeType}
        />

        {/* Loading Overlay for Filter Changes */}
        {loading && movies.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <div className="text-sm text-gray-300">Updating results...</div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-400">
              {totalMovies === 0 ? (
                "No movies found"
              ) : (
                <>
                  Showing {(currentPage - 1) * 10 + 1}-
                  {Math.min(currentPage * 10, totalMovies)} of {totalMovies}{" "}
                  movies
                </>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900 bg-opacity-20 border border-red-700 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Movies Display */}
        {movies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
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
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11a1 1 0 102 0V6a1 1 0 10-2 0zm4 0v11a1 1 0 102 0V6a1 1 0 10-2 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No movies found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria to find more movies.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalMovies={totalMovies}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;