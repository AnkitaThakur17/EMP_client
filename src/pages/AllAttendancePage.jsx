import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAttendance } from "../redux/slices/AttendanceSlice";
import { formatTime } from "../../utils/timeFormatter";

const AllAttendancePage = () => {
  const dispatch = useDispatch();

  const {
    loading,
    token,
    allAttendance: attendance,
  } = useSelector((state) => state.attendance);
console.log("allAttendance", allAttendance)
console.log("attendance", attendance)

  // Filters
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  //api call
useEffect(() => {
  if (token) {
    dispatch(
      allAttendance({
        token,
        pageNo: currentPage,
        search: search || "",
        teamFilter: teamFilter === "all" ? "" : teamFilter.toLowerCase(),
        statusFilter: statusFilter === "all" ? "" : statusFilter,
        startDate: toFilter || "",
        endDate: fromFilter || "",
      })
    )
  }
}, [dispatch, token, currentPage, search, teamFilter, statusFilter, toFilter, fromFilter]);
console.log("allAttendance", allAttendance)
  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [ search, teamFilter, statusFilter, toFilter, fromFilter ]);

  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Attendance Records
      </h3>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {/* Search */}
        <input
          type="text"
          placeholder="Search name or email"
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Status */}
        <select
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="On Time">On-Time</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
        </select>

        {/* Team */}
        <select
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="all">All Teams</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="HR">HR</option>
        </select>

        {/* fromDate */}
        <input
          type="date"
          placeholder="Search name or email"
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={toFilter}
          onChange={(e) => setToFilter(e.target.value)}
        />

        {/* toDate */}
        <input
          type="date"
          placeholder="Search name or email"
          className="border px-3 py-2 rounded-md text-sm w-64"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}

      {!loading && Object.keys(attendance).length === 0 && (
        <p>No attendance records found</p>
      )}

      {!loading &&  Object.keys(attendance).length > 0 && (
        <>
          <table className="table-auto w-full border border-gray-300 rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-2">Date</th>
                <th className="p-2">Employee</th>
                <th className="p-2">Team</th>
                <th className="p-2">Arrival</th>
                <th className="p-2">Leaving</th>
                <th className="p-2">Hours</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.attendance.map((emp) => (
                <tr key={emp._id} className="border-b text-sm">
                  <td className="px-4 py-2">
                    {new Date(emp.punchDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-2">
                    {emp.fullname || emp.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-2">{emp.team || "-"}</td>
                  <td className="px-4 py-2">{formatTime(emp.punchInTime)}</td>
                  <td className="px-4 py-2">{emp.leavingTime || "-"}</td>
                  <td className="px-4 py-2">{emp.workingHours || "-"}</td>
                  <td className="px-4 py-2">{emp.punctualStatus || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-2 text-sm">
            </span>

            <button
              // disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default AllAttendancePage;
