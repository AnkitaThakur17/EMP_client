import { useState } from "react";
import { FiMenu, FiSearch, FiMoon, FiBell, FiSun } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useTheme } from "../hooks/useTheme";

const Navbar = ({ expanded, isLocked, setIsLocked }) => {
  const { theme, toggleTheme } = useTheme();

  const [setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  //toggle sidebar
  const handleToggleSidebar = () => {
  setIsLocked(!isLocked);

};
  return (
    <nav
    className={`
    fixed top-0 right-0 z-10 flex items-center justify-between 
    px-4 py-4.5 shadow-sm transition-all duration-300
    ${expanded || isLocked ? "left-65" : "left-20"}
    ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}
  `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu */}
        <button className="text-gray-600 hover:text-black text-xl"
        onClick={handleToggleSidebar}
        >
        <FiMenu />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        <button
          onClick={toggleTheme}
          className="text-gray-600 hover:text-black text-lg"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src="/download.png"
              alt="User image"
              className="w-8 h-8 rounded-full"
            />
            {user && (
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.fullname}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
