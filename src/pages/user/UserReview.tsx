// ReviewHistoryPage.tsx (Updated)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, Filter } from "lucide-react";
import instance from "../../utils/axios";
import ReviewHistoryCard, { type ReviewHistory } from "../../components/user/review/history/ReviewHistoryCard";
import ReviewHistoryPagination from "../../components/user/review/history/ReviewHistoryPagination";
import { convertRatingToNumber } from "../../utils/rating.converter";

interface UserReviewsResponse {
  message: string;
  review: {
    id: string;
    name: string;
    review: ReviewHistory[];
  };
}

const ReviewHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [allReviews, setAllReviews] = useState<ReviewHistory[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest");
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    sortAndPaginateReviews();
  }, [allReviews, sortBy, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instance.get<UserReviewsResponse>("/api/user/reviews");
      
      const reviewsData = response.data.review.review || [];
      setAllReviews(reviewsData);
      
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch review history";
      setError(errorMessage);
      console.error("Error fetching review history:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortAndPaginateReviews = () => {
    let sortedReviews = [...allReviews];

    switch (sortBy) {
      case "newest":
        sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        sortedReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "rating":
        sortedReviews.sort((a, b) => {
          const ratingA = convertRatingToNumber(a.rating);
          const ratingB = convertRatingToNumber(b.rating);
          return ratingB - ratingA;
        });
        break;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);
    
    setDisplayedReviews(paginatedReviews);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: "newest" | "oldest" | "rating") => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(allReviews.length / itemsPerPage);
  const totalReviews = allReviews.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-800 rounded-lg"></div>
            <div className="h-96 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <History size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Review History</h1>
            <p className="text-gray-400">Your movie reviews and ratings</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">Filter Reviews</h3>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as "newest" | "oldest" | "rating")}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-400">
          {totalReviews === 0 ? (
            "No reviews found"
          ) : (
            <>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalReviews)} of {totalReviews} reviews
            </>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-700 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {displayedReviews.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
          <History size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-400 mb-6">
            You haven't reviewed any movies yet. Start reviewing to see your history here.
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedReviews.map((review, index) => (
              <ReviewHistoryCard 
                key={`${review.Movies.id}-${index}`} 
                review={review} 
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ReviewHistoryPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalReviews={totalReviews}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewHistoryPage;