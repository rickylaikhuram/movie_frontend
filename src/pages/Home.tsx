import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, TrendingUp, Clock } from "lucide-react";
import instance from "../utils/axios";
import MovieCarousel from "../components/user/MovieCarousel";
import type { Movie } from "../types/movie.types";

const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [bestMovies, setBestMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured movies (rating >= 4)
      const featuredResponse = await instance.get("/api/movies", {
        params: { type: "featured", limit: 10 },
      });

      // Fetch best movies (rating >= 3)
      const bestResponse = await instance.get("/api/movies", {
        params: { type: "best", limit: 10 },
      });

      // Fetch latest movies
      const latestResponse = await instance.get("/api/movies", {
        params: { sort: "latest", limit: 10 },
      });

      setFeaturedMovies(featuredResponse.data.movies);
      setBestMovies(bestResponse.data.movies);
      setLatestMovies(latestResponse.data.movies);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch movies";
      setError(errorMessage);
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movies/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-300">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
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
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Amazing Movies
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our curated collection of featured, best-rated, and latest
              movies
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse All Movies
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Featured Movies Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Star className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Featured Movies</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Our top-rated movies with 4+ stars - the best of the best!
          </p>
          <MovieCarousel
            movies={featuredMovies}
            title=""
            onMovieClick={handleMovieClick}
          />
        </section>

        {/* Best Movies Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Best Movies</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Highly rated movies with 3+ stars that you'll love
          </p>
          <MovieCarousel
            movies={bestMovies}
            title=""
            onMovieClick={handleMovieClick}
          />
        </section>

        {/* Latest Movies Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Latest Movies</h2>
          </div>
          <p className="text-gray-400 mb-6">
            The newest additions to our movie collection
          </p>
          <MovieCarousel
            movies={latestMovies}
            title=""
            onMovieClick={handleMovieClick}
          />
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to explore more?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover thousands of movies with advanced filters and search
            options
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View All Movies
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
