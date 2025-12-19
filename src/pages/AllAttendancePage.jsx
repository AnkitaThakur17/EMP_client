import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAttendance } from "../redux/slices/AttendanceSlice";
import { formatTime } from "../../utils/timeFormatter";

const AllAttendancePage = () => {
  const dispatch = useDispatch();

  const { loading, token, allAttendance: attendanceList } = useSelector(
    (state) => state.attendance
  );

  // Filters
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedName, setSelectedName] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (token) {
      dispatch(allAttendance(token));
    }
  }, [dispatch, token]);

  //FILTER + SORT
  const filteredAttendance = useMemo(() => {
    let data = [...(attendanceList || [])];

    // Date filter
    if (selectedDate) {
      data = data.filter(
        (item) =>
          item.punchDate &&
          new Date(item.punchDate).toLocaleDateString("en-CA") === selectedDate
      );
    }

  if (selectedName.trim()) {
  const search = selectedName.trim().toLowerCase();

  data = data.filter((item) => {
    const name =
      item.employee?.fullName ||
      item.employee?.fullname ||
      "";
    return name.toLowerCase().includes(search);
  });
}

    // Status filter
    if (statusFilter !== "all") {
      data = data.filter(
        (item) => item.punctualStatus === statusFilter
      );
    }

    // Team filter
    if (teamFilter !== "all") {
      data = data.filter(
        (item) => item.employee?.team === teamFilter
      );
    }

    // Sort by date
    if (sortBy === "date") {
      data.sort(
        (a, b) => new Date(b.punchDate) - new Date(a.punchDate)
      );
    }
    return data;
  }, [attendanceList, sortBy, statusFilter, teamFilter, selectedDate, selectedName]);

  //PAGINATION (AFTER FILTER)
  const paginatedAttendance = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAttendance.slice(startIndex, endIndex);
  }, [filteredAttendance, currentPage]);

  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  //Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, teamFilter, selectedDate, selectedName]);

  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Attendance Records
      </h3>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 justify-between">
       <div className="flex flex-col w-64">
       <label className="text-gray-600">
       Name
       <input
         type="text"
         className="border px-3 py-2 w-full rounded-md text-sm"
         placeholder="Search by name"
         value={selectedName}
         onChange={(e) => setSelectedName(e.target.value)}
       />
       </label>
       </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600">
            Date
            <input
              type="date"
              className="border px-3 py-2 w-full rounded-md text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600">
            Status
            <select
              className="border px-3 py-2 w-full rounded-md text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="On Time">On Time</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600">
            Team
            <select
              className="border px-3 py-2 w-full rounded-md text-sm"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="all">All Teams</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="HR">HR</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && paginatedAttendance.length === 0 && (
        <p>No attendance records found</p>
      )}

      {!loading && paginatedAttendance.length > 0 && (
        <>
          <table className="table-auto w-full border border-gray-300 rounded-xl border-separate">
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
              {paginatedAttendance.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(emp.punchDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {emp.employee?.fullName || emp.employee?.fullname || "N/A"}
                  </td>
                  <td className="px-4 py-2">{emp.employee?.team || "-"}</td>
                  <td className="px-4 py-2">{formatTime(emp.punchInTime)}</td>
                  <td className="px-4 py-2">{emp.leavingTime || "-"}</td>
                  <td className="px-4 py-2">{emp.workingHours || "-"}</td>
                  <td className="px-4 py-2">{emp.punctualStatus || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION UI */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
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
