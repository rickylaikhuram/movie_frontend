import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import instance from '../utils/axios';
import MovieCard from '../components/user/MovieCard'; // Import the MovieCard component

// Movie interface based on your API response
interface Movie {
  id: string;
  title: string;
  genres: string[];
  releaseYear: string;
  director: string;
  posterUrl: string;
  averageRating: number | null;
}

// API response type
interface MoviesApiResponse {
  message: string;
  movies: Movie[];
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, selectedGenre]);

  const fetchMovies = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await instance.get<MoviesApiResponse>('/api/movies');
      setMovies(response.data.movies);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movies';
      setError(errorMessage);
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = (): void => {
    let filtered = movies;

    // Filter by search term (title or director)
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genres.some(genre => genre.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  };

  const handleMovieClick = (movieId: string): void => {
    navigate(`/movies/${movieId}`);
  };

  // Get all unique genres for filter dropdown
  const getAllGenres = (): string[] => {
    const allGenres = movies.flatMap(movie => movie.genres);
    return [...new Set(allGenres)].sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading movies...</div>
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
            onClick={fetchMovies}
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
              <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
              <p className="text-gray-600 mt-1">
                Discover and explore our collection of {movies.length} movies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search movies by title or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Genre Filter */}
          <div className="sm:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11a1 1 0 102 0V6a1 1 0 10-2 0zm4 0v11a1 1 0 102 0V6a1 1 0 10-2 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {movies.length === 0 ? 'No movies available' : 'No movies found'}
            </h3>
            <p className="text-gray-500">
              {movies.length === 0 
                ? 'There are no movies in the collection yet.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {(searchTerm || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                }}
                className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;