import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { punchIn, punchOut } from "../redux/slices/AttendanceSlice";

const AttendancePage = () => {
  const dispatch = useDispatch();
  const { punchInData, punchOutData, loading, error } = useSelector(
    (state) => state.attendance
  );

  const [attendance, setAttendance] = useState(null);

  //Load data from localStorage when page refresh
  useEffect(() => {
    const saved = localStorage.getItem("attendance");
    if (saved) {
      setAttendance(JSON.parse(saved));
    }
  }, []);

  // Update state when punchIn API returns data
  useEffect(() => {
    if (punchInData) {
      setAttendance(punchInData);
      localStorage.setItem("attendance", JSON.stringify(punchInData)); // save
    }
  }, [punchInData]);

  // Update state when punchOut API returns data
  useEffect(() => {
    if (punchOutData) {
      setAttendance(punchOutData);
      localStorage.setItem("attendance", JSON.stringify(punchOutData)); // save
    }
  }, [punchOutData]);

  //Punch In
  const handlePunchIn = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      userId: user?.user_id,
      punchDate: new Date().toISOString().split("T")[0],
      punchInTime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      punchType: "WEB",
      punctualStatus: "On-Time",
    };

    dispatch(punchIn({ punchInData: payload, token }));
  };

  // Punch Out
  const handlePunchOut = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = { userId: user?.user_id };

    dispatch(punchOut({ punchOutData: payload, token }));
  };
  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Today's Status
      </h3>

      <div className="flex justify-between">
        {/* Left section */}
        <ul className="space-y-2 text-gray-500 font-medium">
          <li>Date</li>
          <li>Arrival Time</li>
          <li>Leaving Time</li>
          <li>Working Hours</li>
          <li>Punctual Status</li>
          <li>Punch Type</li>
        </ul>

        {/* Right section */}
        <ul className="space-y-2 text-gray-900">
          <li>{attendance?.punchDate || "--"}</li>
          <li>{attendance?.punchInTime || "--"}</li>
          <li>{attendance?.leavingTime || "--"}</li>
          <li>{attendance?.workingHours || "--"}</li>
          <li className="text-red-600">{attendance?.punctualStatus || "--"}</li>
          <li>{attendance?.punchType || "--"}</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePunchIn}
          disabled={loading}
          className={`p-2 border w-3/4 border-gray-400 mt-6 rounded-sm text-white mr-4 ${
            loading ? "bg-gray-300" : "bg-gray-600 hover:bg-gray-700"
          }`}
        >
          {loading ? "Punching In..." : "Punch In"}
        </button>

        <button
          onClick={handlePunchOut}
          disabled={loading}
          className={`p-2 border w-3/4 border-gray-400 mt-6 rounded-sm text-black ${
            loading ? "bg-white" : "bg-white hover:bg-gray-200"
          }`}
        >
          {loading ? "Punching Out..." : "Punch Out"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error.message}</p>}
    </div>
  );
};

export default AttendancePage;
