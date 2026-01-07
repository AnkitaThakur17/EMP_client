import {
  Home,
  User,
  Settings,
  LogOut,
  UserRoundPlus,
  BookOpenCheck
  
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/AuthSlice";

export default function AdminSidebar({
  expanded,
  setExpanded,
  isLocked,
  setIsLocked,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }
  };

  //lock sideBar
  return (
    <div
      className={`transition-all duration-300 h-screen bg-white shadow-md flex flex-col fixed left-0 top-0 
    ${expanded || isLocked ? "w-65" : "w-20"}
  `}
    >
      {/* Logo */}
      <div className="p-6">
        <Link
          to="/"
          className={`text-xl font-bold text-blue-600 transition-all duration-300 ${
            expanded || isLocked ? "block" : "hidden"
          }`}
        >
          Admin
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {/* Dashboard */}
          <li>
              <NavLink
              to="/adminDashboard"
              className={({ isActive }) =>
                `flex items-center p-2 transition-colors
       ${
         isActive ? "bg-blue-100 " : "text-gray-700 hover:bg-blue-50"
       }`
              }
            >
              <Home size={20} className="shrink-0 mr-4" />

              {(expanded || isLocked) && (
                <span className="font-medium transition-all duration-300">
                  Dashboard
                </span>
              )}
            </NavLink>
          </li>

          {/* Employees */}
          <li>
            <NavLink
              to="/employeeList"
              className={({ isActive }) =>
                `flex items-center p-2 transition-colors
       ${
         isActive ? "bg-blue-100 text-white" : "text-gray-700 hover:bg-blue-50"
       }`
              }
            >
              <User size={20} className="text-gray-600 shrink-0 mr-4" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Employee Management
                </span>
              )}
            </NavLink>
          </li>

          {/* Create Employee */}
          <li>
            <NavLink
              to="/create-employee"
              className={({ isActive }) =>
                `flex items-center p-2 transition-colors
       ${
         isActive ? "bg-blue-100 text-white" : "text-gray-700 hover:bg-blue-50"
       }`
              }
            >
              <UserRoundPlus size={20} className="text-gray-600 shrink-0 mr-4" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Create Employee
                </span>
              )}
            </NavLink>
          </li>

          {/* Attendance */}
          <li>
            <NavLink
              to="/allAttendance"
              className={({ isActive }) =>
                `flex items-center p-2 transition-colors
       ${
         isActive ? "bg-blue-100 text-white" : "text-gray-700 hover:bg-blue-50"
       }`
              }
            >
              <BookOpenCheck size={20} className="text-gray-600 shrink-0 mr-4" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Attendance Overview
                </span>
              )}
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-2 transition-colors
       ${
         isActive ? "bg-blue-100 text-white" : "text-gray-700 hover:bg-blue-50"
       }`
              }
            >
              <Settings size={20} className="text-gray-600 shrink-0 mr-4" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Settings
                </span>
              )}
            </NavLink>
          </li>

          {/* Logout */}
          <li
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer mt-6 text-red-600"
          >
            <LogOut size={20} className="shrink-0" />
            {(expanded || isLocked) && (
              <span className="font-medium transition-all duration-300">
                {loading ? "Logging out..." : "Logout"}
              </span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
