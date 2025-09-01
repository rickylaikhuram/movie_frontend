export const ratingMap: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
};

export const convertRatingToNumber = (rating: string | number | null | undefined): number => {
  if (rating === null || rating === undefined) return 0;
  
  if (typeof rating === 'number') {
    return rating;
  }
  
  if (typeof rating === 'string') {
    const normalizedRating = rating.toLowerCase().trim();
    return ratingMap[normalizedRating] || 0;
  }
  
  return 0;
};

export const formatRating = (rating: string | number | null | undefined): string => {
  const numericRating = convertRatingToNumber(rating);
  return numericRating.toFixed(1);
};

export const getRatingColor = (rating: string | number | null | undefined): string => {
  const numericRating = convertRatingToNumber(rating);
  if (numericRating >= 4) return "text-green-400";
  if (numericRating >= 3) return "text-yellow-400";
  if (numericRating >= 2) return "text-orange-400";
  return "text-red-400";
};