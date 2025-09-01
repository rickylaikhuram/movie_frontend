import React from 'react';
import { Star, StarHalf, Calendar, Film } from 'lucide-react';

interface ReviewCardProps {
  review: {
    moviesId: string;
    rating: number;
    reviewText: string;
  };
  movieTitle?: string; // Optional, in case you want to fetch movie details
  reviewDate?: string; // Optional, if you add date to your schema
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  movieTitle = "Movie Title", 
  reviewDate 
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Film className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {movieTitle}
            </h3>
            <p className="text-sm text-gray-500">Movie ID: {review.moviesId}</p>
          </div>
        </div>
        {reviewDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(reviewDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-1 mr-3">
          {renderStars(review.rating)}
        </div>
        <span className="text-lg font-medium text-gray-900">
          {review.rating}/5
        </span>
      </div>

      {/* Review Text */}
      <div className="text-gray-700">
        <p className="text-sm leading-relaxed">
          {review.reviewText || "No review text provided."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Review for Movie #{review.moviesId}
          </span>
          <div className="flex items-center space-x-2">
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Edit
            </button>
            <button className="text-xs text-red-600 hover:text-red-800 font-medium">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;