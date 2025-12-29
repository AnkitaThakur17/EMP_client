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
        {/* Nested pages */}
          <Route
            index
            element={
              <div className="p-6 text-gray-700">
                <h1 className="text-2xl font-semibold m-10">Welcome, {user?.fullname}!</h1>
                <p className="mt-2 m-10 text-gray-600">
                 (dashboard content will be here)
                </p>
              </div>
            }
          />
        <Route path="create-employee" element={<CreateEmployee />} />
        <Route path="employeeList" element={<EmployeeList/>} />
        <Route path="employeeProfile" element={<EmployeeProfile/>} />
        <Route path="attendancePage" element={<AttendancePage/>}/>
        <Route path="myAttendance" element={<MyAttendance/>}/>
        <Route path="allAttendance" element={<AllAttendancePage/>}/>
        <Route path="filterActions" element={<FilterActions/>}/>
        </Route>
        

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
