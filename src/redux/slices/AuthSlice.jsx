import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../services/AuthService";

// Safe localStorage parse
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch (err) {
    localStorage.removeItem("user");
    return null;
  }
};

//LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 500,
        message: error.message || "Login failed",
      });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await authService.logout(token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 500,
        message: error.message || "Logout failed",
      });
    }
  }
);

// STATE
const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null, // {code, message}
};

// SLICE 
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      //  LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data;
        state.token = action.payload.data?.token;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("token", state.token);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // { code, message }
      })

      // LOGOUT 
      .addCase(logoutUser.pending, (state) => {
        state.loading = true; 
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;

        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // {code, message}
      });
  },
});

export default authSlice.reducer;
