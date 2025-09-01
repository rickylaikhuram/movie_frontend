import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import instance from "../../utils/axios";

// Types
interface WatchlistIdsResponse {
  watchListIds: string[];
}

export interface WatchlistMovie {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: string;
  genres: string[];
  averageRating: number | null; // Made consistent - not optional
  synopsis?: string; // Optional since it might not always be included
}

// Watchlist entry structure from API
interface WatchlistEntry {
  id: string; // This is the watchlist entry ID
  movies: WatchlistMovie; // This contains the actual movie data
}

// Updated API response structure to match your actual API
interface WatchlistResponse {
  message: string;
  watchList: WatchlistEntry[] | null;
}

// Async thunks
export const toggleWatchlist = createAsyncThunk(
  "watchlist/toggle",
  async (movieId: string) => {
    const response = await instance.post(
      `/api/user/watchlist/toggle/${movieId}`
    );
    return { movieId, removed: response.data.removed };
  }
);

export const fetchWatchlistedIds = createAsyncThunk(
  "watchlist/fetchIds",
  async () => {
    const response = await instance.get<WatchlistIdsResponse>(
      `/api/user/watchlist/ids`
    );
    return response.data;
  }
);

export const fetchWatchlist = createAsyncThunk(
  "watchlist/fetchMovies",
  async () => {
    const response = await instance.get<WatchlistResponse>(
      `/api/user/watchlist`
    );
    return response.data;
  }
);

// State interface
interface WatchlistState {
  watchlistedIds: string[];
  movies: WatchlistMovie[];
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  watchlistedIds: [],
  movies: [],
  loading: false,
  error: null,
};

// Slice
const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWatchlist: (state) => {
      state.watchlistedIds = [];
      state.movies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle watchlist
      .addCase(toggleWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        const { movieId, removed } = action.payload;

        if (removed) {
          // Remove from watchlistedIds
          state.watchlistedIds = state.watchlistedIds.filter(
            (id) => id !== movieId
          );
          // Remove from movies array
          state.movies = state.movies.filter((movie) => movie.id !== movieId);
        } else {
          // Add to watchlistedIds if not already present
          if (!state.watchlistedIds.includes(movieId)) {
            state.watchlistedIds.push(movieId);
          }
        }
      })
      .addCase(toggleWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to toggle watchlist";
      })

      // Fetch watchlist IDs
      .addCase(fetchWatchlistedIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWatchlistedIds.fulfilled,
        (state, action: PayloadAction<WatchlistIdsResponse>) => {
          state.loading = false;
          state.watchlistedIds = action.payload.watchListIds;
        }
      )
      .addCase(fetchWatchlistedIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch watchlist IDs";
      })

      // Fetch full watchlist - Updated to handle the nested API response
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWatchlist.fulfilled,
        (state, action: PayloadAction<WatchlistResponse>) => {
          state.loading = false;
          // Handle the case where watchList can be null
          const watchlistEntries = action.payload.watchList || [];
          // Extract the actual movie data from the nested structure
          const movies: WatchlistMovie[] = watchlistEntries.map((entry) => ({
            ...entry.movies,
            // Ensure averageRating is properly typed as number | null
            averageRating: entry.movies.averageRating ?? null,
          }));
          state.movies = movies;
          // Also update watchlistedIds from the movie IDs
          state.watchlistedIds = movies.map((movie) => movie.id);
        }
      )
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch watchlist";
      });
  },
});

// Actions
export const { clearError, clearWatchlist } = watchlistSlice.actions;

// Selectors
export const selectWatchlistedIds = (state: { watchlist: WatchlistState }) =>
  state.watchlist.watchlistedIds;
export const selectWatchlistMovies = (state: { watchlist: WatchlistState }) =>
  state.watchlist.movies;
export const selectWatchlistLoading = (state: { watchlist: WatchlistState }) =>
  state.watchlist.loading;
export const selectWatchlistError = (state: { watchlist: WatchlistState }) =>
  state.watchlist.error;
export const selectIsMovieWatchlisted = (movieId: string) => (state: { watchlist: WatchlistState }) =>
  state.watchlist.watchlistedIds.includes(movieId);

export default watchlistSlice.reducer;