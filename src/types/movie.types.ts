// Movie interface based on your API response
export interface Movie {
  id: string;
  title: string;
  genres: string[];
  releaseYear: string;
  director: string;
  posterUrl: string;
  averageRating: number | null;
}

// API response type
export interface MoviesApiResponse {
  message: string;
  page: number;
  totalMovies: number;
  totalPages: number;
  movies: Movie[];
}