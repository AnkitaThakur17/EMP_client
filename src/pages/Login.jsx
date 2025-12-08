import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login Success:", result);
      navigate("/");
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };
  return (
    <div className="flex min-h-screen px-4">
      {/* Left Section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-20 bg-white">
        <h1 className="text-3xl font-bold mb-2">Login</h1>
        <p className="text-gray-500 mb-8">
          Enter your email and password to log in!
        </p>

        {/* FIXED ERROR HANDLING */}
        {error?.message && <p className="text-red-500 mb-3">{error.message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>

            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-400 rounded-md px-3 py-2 pr-10 
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 bg-[#0B1437] text-white items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/squares.png')] opacity-10"></div>
        <div className="text-center z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-indigo-500 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 1115 0m-15 0a7.5 7.5 0 0015 0m-15 0h15"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">
              Welcome to Employee Monitoring
            </h2>
          </div>
          <p className="text-gray-300 text-sm">Login to explore your role</p>
        </div>
      </div>
    </div>
  );
}
