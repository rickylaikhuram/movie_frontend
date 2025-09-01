import React from "react";
import { Star, Calendar, Film, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { convertRatingToNumber, formatRating, getRatingColor } from "../../../../utils/rating.converter";

export interface ReviewHistory {
  rating: string | number;
  reviewText: string;
  createdAt: string;
  Movies: {
    id: string;
    title: string;
  };
}

interface ReviewHistoryCardProps {
  review: ReviewHistory;
}

const ReviewHistoryCard: React.FC<ReviewHistoryCardProps> = ({ review }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleMovieClick = () => {
    navigate(`/movies/${review.Movies.id}`);
  };

  const numericRating = convertRatingToNumber(review.rating);
  const roundedRating = Math.round(numericRating);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Movie Header */}
      <div 
        onClick={handleMovieClick}
        className="flex items-center justify-between mb-4 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Film size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
              {review.Movies.title}
            </h3>
            <p className="text-gray-400 text-sm">Click to view movie</p>
          </div>
        </div>
        <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
      </div>

      {/* Rating and Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= roundedRating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className={`text-lg font-semibold ${getRatingColor(review.rating)}`}>
            {formatRating(review.rating)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar size={14} />
          <span>{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <h4 className="text-white font-medium mb-2">Your Review:</h4>
        <p className="text-gray-300 leading-relaxed bg-gray-900 rounded-lg p-4 border border-gray-700">
          {review.reviewText}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={handleMovieClick}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Film size={16} />
        View Movie Details
      </button>
    </div>
  );
};

export default ReviewHistoryCard;