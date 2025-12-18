import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import attendanceService from "../services/AttendanceService";

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

// Async thunk
export const punchIn = createAsyncThunk(
  "attendance/punchIn",
  async ({ punchInData, token }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.punchIn(punchInData, token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 0,
        message: error.message || "Something went wrong",
      });
    }
  }
);

//punchOut
export const punchOut = createAsyncThunk(
  "attendance/punchOut",
  async ({ punchOutData, token }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.punchOut(punchOutData, token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 0,
        message: error.message || "Something went wrong",
      });
    }
  }
);

//myAttendance
export const myAttendance = createAsyncThunk(
  "attendance/myAttendance",
  async (token, { rejectWithValue }) => {
    try {
      const response = await attendanceService.myAttendance(token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 0,
        message: error.message || "Something went wrong",
      });
    }
  }
);

//allAttendance
export const allAttendance = createAsyncThunk(
  "attendance/allAttendance",
  async(token,{ rejectWithValue }) => {
    try {
      const response = await attendanceService.allAttendance(token);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        code: error.code || 0,
        message: error.message || "Something went wrong",
      });
    }
  }
)


// Initial state
const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  punchInData: null, // store punchIn response
  data: [],
  employees: [],
  allAttendance: [],
};

// Slice
const attendanceSlice = createSlice({
  name:"attendance",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(punchIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.loading = false;
        state.punchInData = action.payload.data;
      })
      .addCase(punchIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 0,
          message: "Failed to punch in",
        };
      })

      //punchOut
      .addCase(punchOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.loading = false;
        state.punchOutData = action.payload.data;
      })
      .addCase(punchOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 0,
          message: "failed to punch out",
        };
      })

      //myAttendance
      .addCase(myAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(myAttendance.fulfilled, (state, action) => {
        state.loading = false;

        const result = action.payload.data;

        // Ensure the data is always an array
        state.myAttendance = Array.isArray(result) ? result : [result];
      })
      // .addCase(myAttendance.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.myAttendance = action.payload.data
      // })
      .addCase(myAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 0,
          message: "failed to load my attendance",
        };
      })
      //allAttendance
      .addCase(allAttendance.pending,(state, action)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(allAttendance.fulfilled,(state, action)=>{
        state.loading = false;
        state.allAttendance = action.payload
      })
      .addCase(allAttendance.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload || {
          code:0,
          message: "failed to load all attendance",
        }
      })
  },
});

export const { resetError, logout } = attendanceSlice.actions;
export default attendanceSlice.reducer;
