import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myAttendance } from "../redux/slices/AttendanceSlice";
import { formatTime } from "../../utils/timeFormatter";

const MyAttendance = () => {
  const dispatch = useDispatch();
  const {
    loading,
    token,
    myAttendance: data,
    error,
  } = useSelector((state) => state.attendance);
  // console.log("Attendance Data:", data);

  useEffect(() => {
    if (token) dispatch(myAttendance(token));
  }, [token, dispatch]);

  return (
    <div className="p-10 bg-white border border-gray-200 rounded-xl mt-10 shadow-sm">
      <h1 className="text-2xl mb-6 text-gray-800 font-semibold">
        Recent Attendance
      </h1>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-600 animate-pulse">Fetching your glow-up...</p>
      )}

      {/* Error State */}
      {!loading && error && (
        <p className="text-red-500 font-medium">
          {error.message || "Something went wrong"}
        </p>
      )}

      {/* No Data */}
      {!loading && !error && (!data || data.length === 0) && (
        <p className="text-gray-600">Bruh… no attendance found</p>
      )}

      {/* Table */}
      {!loading && data?.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mt-4">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-medium text-gray-700">Date</th>
                <th className="p-3 font-medium text-gray-700">Punch In</th>
                <th className="p-3 font-medium text-gray-700">Punch Out</th>
                <th className="p-3 font-medium text-gray-700">Total Hours</th>
                <th className="p-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((att, index) => {
                const punchDate = new Date(att.punchDate).toLocaleDateString();
                const punchInTime = att.punchInTime || "-";
                const leavingTime = att.leavingTime || "-";
                const workingHours = att.totalHours || "0 hrs";
                const statusColor =
                  att.punctualStatus === "On-Time"
                    ? "text-green-600"
                    : att.punctualStatus === "Late"
                    ? "text-red-600"
                    : "text-red-600";
                    
                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-3">{new Date(att.punchDate).toLocaleDateString("en-GB",{
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}</td>
                    <td className="p-3">{formatTime(att.punchInTime)}</td>
                    <td className="p-3">{leavingTime}</td>
                    <td className="p-3">{workingHours}</td>
                    <td className={`p-3 font-semibold ${statusColor}`}>
                      {att.punctualStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;
