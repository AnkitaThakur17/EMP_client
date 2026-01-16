import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myAttendance } from "../redux/slices/AttendanceSlice";
import { formatTime } from "../../utils/timeFormatter";

const MyAttendance = () => {
  const dispatch = useDispatch();
  const {
    loading,
    token,
    myAttendance: data = [],
    error,
  } = useSelector((state) => state.attendance);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(()=>{

     if (!Array.isArray(data)) return [];

    const startIndex = (currentPage -1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  },[data, currentPage]) 

  const totalPages = Math.ceil(data.length / itemsPerPage);


  useEffect(() => {
    if (token) dispatch(myAttendance(token));
  }, [token, dispatch]);

  //paginate
  useEffect(() => {
  setCurrentPage(1);
}, [data]);

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
              {paginatedData.map((att, index) => {
                const punchDate = new Date(att.punchDate).toLocaleDateString();
                const punchInTime = att.punchInTime || "-";
                const leavingTime = att.leavingTime || "-";
                const workingHours = att.totalHours || "-";
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
                    <td className="px-3">
                      {new Date(att.punchDate).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3">{formatTime(att.punchInTime)}</td>
                    <td className="p-3">{formatTime(att.leavingTime)}</td>
                    <td className="p-3">{att.workingHours}</td>
                    <td className={`p-3 font-semibold ${statusColor}`}>
                      {att.punctualStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 mb-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page ? "bg-indigo-600 text-white" : ""
                     }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAttendance;
