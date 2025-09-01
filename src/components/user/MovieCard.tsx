import React from 'react';
import { Star, Calendar, User } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  genres: string[];
  releaseYear: string;
  director: string;
  posterUrl: string;
  averageRating: number | null;
}

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x450/e5e7eb/9ca3af?text=No+Image';
  };

  const formatRating = (rating: number | null): string => {
    if (rating === null || rating === undefined) return '0.0';
    return rating.toFixed(1);
  };

  const getRatingColor = (rating: number | null): string => {
    if (!rating) return 'text-gray-600 bg-gray-100';
    if (rating >= 4) return 'text-green-600 bg-green-100';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 2) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group overflow-hidden"
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          onError={handleImageError}
          className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(movie.averageRating)}`}>
            <Star size={12} className="fill-current" />
            <span>{formatRating(movie.averageRating)}</span>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Movie Details */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>

        {/* Release Year */}
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
          <Calendar size={14} />
          <span>{movie.releaseYear}</span>
        </div>

        {/* Director */}
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <User size={14} />
          <span className="line-clamp-1">{movie.director}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
            >
              {genre}
            </span>
          ))}
          {movie.genres.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              +{movie.genres.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Section with Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${
                    star <= Math.round(movie.averageRating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({formatRating(movie.averageRating)})
            </span>
          </div>
          
          <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
            View Details →
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;