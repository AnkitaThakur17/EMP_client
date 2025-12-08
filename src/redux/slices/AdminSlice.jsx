import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "../services/AdminService";

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

//create employee
export const createEmployee = createAsyncThunk(
  "admin/createEmployee",
  async ({ employeeData, token }, { rejectWithValue }) => {
    try {
      const response = await adminService.createEmployee(employeeData, token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
      });
    }
  }
);

//get employees
export const getEmployees = createAsyncThunk(
  "admin/getEmployees",
  async (token, { rejectWithValue }) => {
    try {
      const response = await adminService.getEmployees(token);
      return response; // array of employees
    } catch (error) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
      });
    }
  }
);

//get employee
export const getEmployee = createAsyncThunk(
  "admin/getEmployee",
  async (token, { rejectWithValue }) => {
    try {
      const response = await adminService.getEmployee(token);
      return response;
    } catch (error) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
      });
    }
  }
);

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  employees: [],
  employee: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      //create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })

      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get Employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data.employees;
      })

      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get single Employee
      .addCase(getEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload.data.employee;
      })

      .addCase(getEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
