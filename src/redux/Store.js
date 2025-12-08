import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import adminReducer from "./slices/AdminSlice";
import themeReducer from "./slices/ThemeSlice";
import attendanceReducer from "./slices/AttendanceSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    theme: themeReducer,
    attendance: attendanceReducer,
  },
});
