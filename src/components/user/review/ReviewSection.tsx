import React, { useState, useEffect } from "react";
import {  MessageSquare } from "lucide-react";
import instance from "../../../utils/axios";
import ReviewCard, {type Review } from "./ReviewCard";
import ReviewPagination from "./ReviewPagination";

interface ReviewsSectionProps {
  movieId: string;
  movieTitle: string;
}

interface ReviewsResponse {
  message: string;
  page: number;
  totalReviews: number;
  totalPages: number;
  hasMore: boolean;
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId, movieTitle }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Load reviews immediately when component mounts
    fetchReviews(1);
  }, []);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await instance.get<ReviewsResponse>(
        `/api/movies/${movieId}/reviews`,
        { params: { page } }
      );

      const safeReviews = response.data.reviews.map(review => ({
        ...review,
        user: review.user || undefined
      }));

      setReviews(safeReviews);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
      setTotalReviews(response.data.totalReviews);
      setHasLoaded(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No reviews found for this movie");
      } else if (err.response?.status === 403) {
        setError("Movie ID is required");
      } else {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch reviews";
        setError(errorMessage);
      }
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  if (loading && !hasLoaded) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MessageSquare className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">User Reviews</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-700 rounded"></div>
                    <div className="w-32 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-6 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-gray-700 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="w-20 h-3 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <MessageSquare className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">User Reviews</h2>
        {totalReviews > 0 && (
          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
            {totalReviews} reviews
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchReviews(currentPage)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {hasLoaded && reviews.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-400">
            Be the first to review "{movieTitle}"
          </p>
        </div>
      )}

      {hasLoaded && reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <ReviewPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalReviews={totalReviews}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
};

export default ReviewsSection;