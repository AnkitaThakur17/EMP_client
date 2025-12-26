import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import attendanceService from "../services/AttendanceService";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") {
      localStorage.removeItem("user"); 
      return null;
    }
    return JSON.parse(stored);
  } catch (err) {
    localStorage.removeItem("user"); 
    return null;
  }
};

// Async thunks
export const punchIn = createAsyncThunk(
  "attendance/punchIn",
  async ({ punchInData }, { rejectWithValue }) => {
    try {
      return await attendanceService.punchIn(punchInData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const punchOut = createAsyncThunk(
  "attendance/punchOut",
  async ({ punchOutData }, { rejectWithValue }) => {
    try {
      return await attendanceService.punchOut(punchOutData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const myAttendance = createAsyncThunk(
  "attendance/myAttendance",
  async (_, { rejectWithValue }) => {
    try {
      return await attendanceService.myAttendance();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const allAttendance = createAsyncThunk(
  "attendance/allAttendance",
  async (
    { pageNo, limit, search, teamFilter, statusFilter, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      return await attendanceService.allAttendance({
        pageNo,
        limit,
        search,
        teamFilter,
        statusFilter,
        startDate,
        endDate,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// Initial state
const initialState = {

  user: getStoredUser(),
  token: localStorage.getItem("token") || null,

  loading: false,
  error: null,

  punchInData: null,
  punchOutData: null,

  myAttendance: [],
  allAttendance: [],

  pageNo: 1,
  limit: 5,
  // totalPages: 2,

  search: "",
  filters: {
    team: "",
    status: "",
    startDate: "",
    endDate: ""
  },
};

// Slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setTeamFilter: (state, action) => {
      state.filters.team = action.payload;
      state.pageNo = 1;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      state.pageNo = 1;
    },
    setPageNo: (state, action) => {
      state.pageNo = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // punchIn
      .addCase(punchIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.loading = false;
        state.punchInData = action.payload.data;
      })
      .addCase(punchIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // punchOut
      .addCase(punchOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.loading = false;
        state.punchOutData = action.payload.data;
      })
      .addCase(punchOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // myAttendance
      .addCase(myAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(myAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = Array.isArray(action.payload.data)
          ? action.payload.data
          : [action.payload.data];
      })
      .addCase(myAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // allAttendance
      .addCase(allAttendance.pending, (state) => {
        state.loading = true;
      })

      .addCase(allAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // backend rray
        state.allAttendance = action.payload.data;
        console.log("allAttendance", allAttendance)

        // frontend-only pagination
        state.totalPages = Math.ceil(action.payload.data.length / state.limit);
      })

      .addCase(allAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTeamFilter, setStatusFilter, setPageNo, resetError } =
  attendanceSlice.actions;

export default attendanceSlice.reducer;
