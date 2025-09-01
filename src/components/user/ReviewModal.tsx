import React, { useState } from "react";
import { X, Star } from "lucide-react";

// Rating type using string literals
export type Rating = "ZERO" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: string, rating: Rating) => void;
  movieTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  movieTitle,
}) => {
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<Rating>("ZERO");
  const [hoveredRating, setHoveredRating] = useState<Rating | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.trim()) {
      onSubmit(review.trim(), rating);
      // Reset form
      setReview("");
      setRating("ZERO");
      setHoveredRating(null);
    }
  };

  const handleCancel = () => {
    // Reset form
    setReview("");
    setRating("ZERO");
    setHoveredRating(null);
    onClose();
  };

  const getRatingNumber = (ratingEnum: Rating): number => {
    switch (ratingEnum) {
      case "ZERO":
        return 0;
      case "ONE":
        return 1;
      case "TWO":
        return 2;
      case "THREE":
        return 3;
      case "FOUR":
        return 4;
      case "FIVE":
        return 5;
      default:
        return 0;
    }
  };

  const getRatingFromNumber = (num: number): Rating => {
    switch (num) {
      case 0:
        return "ZERO";
      case 1:
        return "ONE";
      case 2:
        return "TWO";
      case 3:
        return "THREE";
      case 4:
        return "FOUR";
      case 5:
        return "FIVE";
      default:
        return "ZERO";
    }
  };

  const handleStarClick = (starNumber: number) => {
    setRating(getRatingFromNumber(starNumber));
  };

  const handleStarHover = (starNumber: number) => {
    setHoveredRating(getRatingFromNumber(starNumber));
  };

  const handleStarLeave = () => {
    setHoveredRating(null);
  };

  if (!isOpen) return null;

  const displayRating = hoveredRating !== null ? getRatingNumber(hoveredRating) : getRatingNumber(rating);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Write a Review</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Movie Title */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm">
              Reviewing: <span className="text-white font-medium">{movieTitle}</span>
            </p>
          </div>

          {/* Rating Section */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starNumber) => (
                <button
                  key={starNumber}
                  type="button"
                  onClick={() => handleStarClick(starNumber)}
                  onMouseEnter={() => handleStarHover(starNumber)}
                  onMouseLeave={handleStarLeave}
                  className="transition-colors hover:scale-110 transform transition-transform"
                >
                  <Star
                    size={28}
                    className={`${
                      starNumber <= displayRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600 hover:text-gray-500"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-300 text-sm">
                ({displayRating}/5)
              </span>
            </div>
          </div>

          {/* Review Text Input */}
          <div className="mb-6">
            <label htmlFor="review" className="block text-white font-medium mb-2">
              Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your thoughts about this movie..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!review.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;