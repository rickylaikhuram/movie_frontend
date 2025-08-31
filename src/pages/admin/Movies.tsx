import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import instance from "../../utils/axios";
import MovieForm from "../../components/admin/forms/AddMovieForm"; // Import your MovieForm component

// Movie interface
interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genres: string;
  averageRating: number;
  director?: string;
  posterUrl?: string;
}

// API response type
interface MoviesApiResponse {
  message: string;
  movies: Movie[];
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async (): Promise<void> => {
    try {
      setLoading(true);
      // Fetch movies with correct response structure
      const response = await instance.get<MoviesApiResponse>("/api/movies");
      setMovies(response.data.movies);

      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch movies";
      setError(errorMessage);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = (): void => {
    setShowAddForm(true);
  };

  const handleCloseForm = (): void => {
    setShowAddForm(false);
    fetchMovies();
  };

  const handleEditMovie = (movieId: string | number): void => {
    // Navigate to edit movie page or open modal
    console.log("Edit movie clicked for ID:", movieId);
  };

  // Show the add movie form as a full-page overlay
  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with close button */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Add New Movie</h1>
            <button
              onClick={handleCloseForm}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6">
          <MovieForm
            onMovieCreated={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
          <button
            onClick={handleAddMovie}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Add Movie
          </button>
        </div>

        {/* Movies List */}
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No movies found</div>
            <p className="text-gray-400 mt-2">
              Start by adding your first movie
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Title
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Year
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Genre
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Rating
                    </th>
                    <th className="text-center py-4 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie: Movie) => (
                    <tr key={movie.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">
                          {movie.title}
                        </div>
                        {movie.director && (
                          <div className="text-sm text-gray-500">
                            Dir: {movie.director}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {movie.releaseYear}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {movie.genres}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {movie.averageRating
                            ? `${movie.averageRating}/5`
                            : "No Rating"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleEditMovie(movie.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Movies Count */}
        {movies.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Total movies: {movies.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
