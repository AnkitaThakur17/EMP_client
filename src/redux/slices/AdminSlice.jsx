import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "../services/AdminService";

// Safe localStorage parse
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

//get Employees
export const getEmployees = createAsyncThunk(
  "admin/getEmployees",
  async ({ token, pageNo, limit, search, teamFilter }, { rejectWithValue }) => {
    try {
      const response = await adminService.getEmployees({
        token,
        pageNo,
        limit,
        search,
        teamFilter
      });
      return response;
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

export const updateEmployee = createAsyncThunk(
  "admin/updateEmployee",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const res = await adminService.updateEmployeeService(userId, userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
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
  pageNo: 1,
  limit: 5,
  totalPages: 0,
  search: "",
  filters :{
    team: ""
  }
};
const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    setTeamFilter: (state, action) => {
    state.filters.team = action.payload;
    state.pageNo = 1;
  },
  },

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

      //get all employees
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;

        const { employees, count } = action.payload.data;

        state.employees = employees;
        state.totalPages = Math.ceil(count / state.limit);
        state.count = action.payload.data.count;
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
      })

      //update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateEmployee.fulfilled, (state, action) => {
         state.loading = false; 
        const updatedEmployee = action.payload;
        state.employees = state.employees.map((emp) =>
          emp._id.toString() === updatedEmployee._id.toString()
            ? updatedEmployee
            : emp
        );
      })

      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
  
});
export const { setTeamFilter } = adminSlice.actions;
export default adminSlice.reducer;