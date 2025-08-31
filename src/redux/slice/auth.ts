import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState } from "../../types/auth.types";
import instance from "../../utils/axios";

const initialState: AuthState = {
  status: "idle",
  user: null,
  error: null,
};

// Fetch auth details
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async () => {
  const response = await instance.get("/api/auth/me");
  localStorage.setItem("authToken", response.data.token);
  return response.data.user;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("authToken");
      state.status = "idle";
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAuth.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
