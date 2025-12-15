import {
  Home,
  User,
  ShoppingCart,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
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
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <Home size={20} className="text-gray-600 shrink-0" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Dashboard
                </span>
              )}
            </Link>
          </li>

          {/* Employees */}
          <li>
            <Link
              to="/employeeList"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <User size={20} className="text-gray-600 shrink-0" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Employee Management
                </span>
              )}
            </Link>
          </li>

          {/* Create Employee */}
          <li>
            <Link
              to="/create-employee"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <ShoppingCart size={20} className="text-gray-600 shrink-0" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Create Employee
                </span>
              )}
            </Link>
          </li>

          {/* Attendance */}
          <li>
            <Link
              to="/attendance"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <Calendar size={20} className="text-gray-600 shrink-0" />
              {(expanded || isLocked) && (
                <Link to="/allAttendance" className="text-gray-700 font-medium transition-all duration-300">
                  Attendance Overview
                </Link>
              )}
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50"
            >
              <Settings size={20} className="text-gray-600 shrink-0" />
              {(expanded || isLocked) && (
                <span className="text-gray-700 font-medium transition-all duration-300">
                  Settings
                </span>
              )}
            </Link>
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
