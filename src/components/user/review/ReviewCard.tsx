import React from "react";
import { Star, User } from "lucide-react";
import{ convertRatingToNumber, formatRating, getRatingColor } from "../../../utils/rating.converter";

export interface Review {
  id: string;
  rating?: string | number | null; // Can be string like "one", "two", etc.
  reviewText: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Safe user data with fallbacks
  const userName = review.user?.name || "Anonymous User";
  const userEmail = review.user?.email || "";
  
  // Convert rating to number and get safe values
  const numericRating = convertRatingToNumber(review.rating);
  const roundedRating = Math.round(numericRating);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
          <div>
            <h4 className="text-white font-medium">{userName}</h4>
            {userEmail && (
              <p className="text-gray-400 text-sm">{userEmail}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
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
          <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
            {formatRating(review.rating)}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-300 mb-4 leading-relaxed">{review.reviewText}</p>

      {/* Review Date */}
      <div className="text-gray-500 text-sm">
        {formatDate(review.createdAt)}
      </div>
    </div>
  );
};

export default ReviewCard;