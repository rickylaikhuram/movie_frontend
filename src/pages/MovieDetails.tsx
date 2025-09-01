import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Globe,
  MapPin,
  User,
  Play,
  Share2,
  Heart,
  Edit,
} from "lucide-react";
import instance from "../utils/axios";
import ReviewModal, { type Rating } from "../components/user/ReviewModal";
import { 
  toggleWatchlist, 
  fetchWatchlistedIds,
  selectIsMovieWatchlisted,
  selectWatchlistLoading 
} from "../redux/slice/watchlist";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Movie interface based on your API response
interface Movie {
  id: string;
  title: string;
  genres: string[];
  releaseYear: string;
  director: string;
  posterUrl: string;
  averageRating: number | null;
  cast: string[];
  synopsis: string;
  runtime: number | null;
  language: string;
  country: string;
  backdropUrl: string;
  trailerUrl: string;
  createdAt: string;
}

// API response type
interface MovieApiResponse {
  message: string;
  movies: Movie;
}

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state - use defensive selector
  const isWatchlisted = useAppSelector(state => {
    if (!id) return false;
    return selectIsMovieWatchlisted(id)(state);
  });
  const watchlistLoading = useAppSelector(selectWatchlistLoading);

  // Local state
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchMovie(id);
      // Fetch watchlist IDs when component mounts
      dispatch(fetchWatchlistedIds());
    }
  }, [id, dispatch]);

  const fetchMovie = async (movieId: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await instance.get<MovieApiResponse>(
        `/api/movies/${movieId}`
      );
      setMovie(response.data.movies);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch movie details";
      setError(errorMessage);
      console.error("Error fetching movie:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://via.placeholder.com/400x600/e5e7eb/9ca3af?text=No+Image";
  };

  const handleBackdropError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  };

  const formatRating = (rating: number | null): string => {
    if (rating === null || rating === undefined) return "0.0";
    return rating.toFixed(1);
  };

  const formatRuntime = (runtime: number | null): string => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getRatingColor = (rating: number | null): string => {
    if (!rating) return "text-gray-600";
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    if (rating >= 2) return "text-orange-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openTrailer = (): void => {
    if (movie?.trailerUrl) {
      window.open(movie.trailerUrl, "_blank");
    }
  };

  const handleReviewSubmit = async (reviewText: string, rating: Rating) => {
    try {
      setLoading(true);
      await instance.post<MovieApiResponse>(`/api/user/movies/${id}/reviews`, {
        reviewData: {
          reviewText: reviewText,
          rating: rating,
        },
      });
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to Add review";
      setError(errorMessage);
      console.error("Error Adding Review :", err);
    } finally {
      setLoading(false);
      setIsReviewModalOpen(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (id) {
      try {
        await dispatch(toggleWatchlist(id)).unwrap();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle watchlist";
        setError(errorMessage);
        console.error("Error toggling watchlist:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-white">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">
            {error || "Movie not found"}
          </div>
          <div className="space-x-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            {id && (
              <button
                onClick={() => fetchMovie(id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Backdrop Image with Overlay */}
      {movie.backdropUrl && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={movie.backdropUrl}
            alt={`${movie.title} backdrop`}
            onError={handleBackdropError}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/20"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative -mt-32 md:-mt-48 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Movies
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="lg:w-1/3 xl:w-1/4">
              <div className="sticky top-8">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={handleImageError}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:w-2/3 xl:w-3/4">
              {/* Title and Basic Info */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                {/* Rating and Quick Info */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={`${
                            star <= Math.round(movie.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-lg font-semibold ${getRatingColor(
                        movie.averageRating
                      )}`}
                    >
                      {formatRating(movie.averageRating)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar size={16} />
                    <span>{movie.releaseYear}</span>
                  </div>

                  <div className="flex items-wrap items-center gap-1 text-gray-300">
                    <Clock size={16} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <Globe size={16} />
                    <span>{movie.language}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-300">
                    <MapPin size={16} />
                    <span>{movie.country}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {movie.trailerUrl && (
                    <button
                      onClick={openTrailer}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Play size={20} />
                      Watch Trailer
                    </button>
                  )}
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Edit size={20} />
                    Write Review
                  </button>
                  <button
                    onClick={handleToggleWatchlist}
                    disabled={watchlistLoading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isWatchlisted
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    } ${watchlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Heart 
                      size={20} 
                      className={isWatchlisted ? "fill-current" : ""} 
                    />
                    {watchlistLoading 
                      ? "Loading..." 
                      : isWatchlisted 
                        ? "Remove from Watchlist" 
                        : "Add to Watchlist"
                    }
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Director */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Director
                </h3>
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={18} />
                  <span className="text-lg">{movie.director}</span>
                </div>
              </div>

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Cast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {movie.cast.map((actor, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                        <p className="text-white font-medium text-sm">
                          {actor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Movie Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <span className="font-medium text-white">
                      Release Year:
                    </span>{" "}
                    {movie.releaseYear}
                  </div>
                  <div>
                    <span className="font-medium text-white">Runtime:</span>{" "}
                    {formatRuntime(movie.runtime)}
                  </div>
                  <div>
                    <span className="font-medium text-white">Language:</span>{" "}
                    {movie.language}
                  </div>
                  <div>
                    <span className="font-medium text-white">Country:</span>{" "}
                    {movie.country}
                  </div>
                  <div>
                    <span className="font-medium text-white">Director:</span>{" "}
                    {movie.director}
                  </div>
                  <div>
                    <span className="font-medium text-white">Added on:</span>{" "}
                    {formatDate(movie.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        movieTitle={movie.title}
      />
    </div>
  );
};

export default MovieDetailsPage;