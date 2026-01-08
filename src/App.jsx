import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeList from "./pages/EmployeeList";
import EmployeeProfile from "./pages/EmployeeProfile";
import AttendancePage from "./pages/AttendancePage";
import MyAttendance from "./pages/MyAttendance";
import AllAttendancePage from "./pages/AllAttendancePage";
import FilterActions from "./components/FilterActions";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* Protected Routes (inside MainLayout) */}
        <Route
          path="/"
          element={
            user ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          {/* DEFAULT PAGE AFTER LOGIN */}

          <Route
            index
            element={
              user?.role === "admin" && (
                <Navigate to="adminDashboard" replace />
              )
            }
          />

          {/* for user */}
          {/* <Route
            index
            element={
              user?.role === "admin" ? (
                <Navigate to="adminDashboard" replace />
              ) : (
                <Navigate to="attendancePage" replace />
              )
            }
          /> */}

        {/* Nested pages */}
        <Route path="create-employee" element={<CreateEmployee />} />
        <Route path="employeeList" element={<EmployeeList/>} />
        <Route path="employeeProfile" element={<EmployeeProfile/>} />
        <Route path="attendancePage" element={<AttendancePage/>}/>
        <Route path="myAttendance" element={<MyAttendance/>}/>
        <Route path="allAttendance" element={<AllAttendancePage/>}/>
        <Route path="filterActions" element={<FilterActions/>}/>
        <Route path="adminDashboard" element={<AdminDashboard/>}/>      
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
