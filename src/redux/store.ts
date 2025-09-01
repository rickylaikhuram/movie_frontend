import { configureStore } from "@reduxjs/toolkit";
import Auth from "./slice/auth";
import Watchlist from "./slice/watchlist";

export const store = configureStore({
  reducer: {
    auth: Auth,
    watchlist: Watchlist,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
