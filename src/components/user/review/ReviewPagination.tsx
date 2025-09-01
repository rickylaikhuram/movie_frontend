import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  onPageChange: (page: number) => void;
}

const ReviewPagination: React.FC<ReviewPaginationProps> = ({
  currentPage,
  totalPages,
  totalReviews,
  onPageChange,
}) => {
  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (totalPages <= 1) return null;
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-700">
      <div className="text-sm text-gray-400">
        Showing {(currentPage - 1) * 5 + 1}-
        {Math.min(currentPage * 5, totalReviews)} of {totalReviews} reviews
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReviewPagination;