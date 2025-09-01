import React from "react";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  searchTerm: string;
  selectedGenre: string;
  selectedYear: string;
  sortBy: string;
  movieType: string;
  onRemoveSearch: () => void;
  onRemoveGenre: () => void;
  onRemoveYear: () => void;
  onRemoveSort: () => void;
  onRemoveType: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  selectedGenre,
  selectedYear,
  sortBy,
  movieType,
  onRemoveSearch,
  onRemoveGenre,
  onRemoveYear,
  onRemoveSort,
  onRemoveType,
}) => {
  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "rating", label: "Highest Rated" },
  ];

  const typeOptions = [
    { value: "", label: "All Movies" },
    { value: "featured", label: "Featured (4 + ⭐)" },
    { value: "best", label: "Best Movies (3 + ⭐)" },
  ];

  const hasActiveFilters = searchTerm || selectedGenre || selectedYear || sortBy !== "latest" || movieType;

  if (!hasActiveFilters) return null;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-400">Active filters:</span>

        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200 border border-blue-700">
            Search: "{searchTerm}"
            <button
              onClick={onRemoveSearch}
              className="ml-2 text-blue-300 hover:text-blue-100 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {selectedGenre && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200 border border-green-700">
            Genre: {selectedGenre}
            <button
              onClick={onRemoveGenre}
              className="ml-2 text-green-300 hover:text-green-100 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {selectedYear && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-200 border border-purple-700">
            Year: {selectedYear}
            <button
              onClick={onRemoveYear}
              className="ml-2 text-purple-300 hover:text-purple-100 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {sortBy !== "latest" && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200 border border-yellow-700">
            Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
            <button
              onClick={onRemoveSort}
              className="ml-2 text-yellow-300 hover:text-yellow-100 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        )}

        {movieType && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200 border border-red-700">
            Type: {typeOptions.find((opt) => opt.value === movieType)?.label}
            <button
              onClick={onRemoveType}
              className="ml-2 text-red-300 hover:text-red-100 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;