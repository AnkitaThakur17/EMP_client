import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAttendance } from "../redux/slices/AttendanceSlice";
import { getEmployee } from "../redux/slices/AdminSlice";
import { formatTime } from "../../utils/timeFormatter";
import FilterActions from "../components/FilterActions";

const AllAttendancePage = () => {
  const dispatch = useDispatch();

  const {
    loading,
    token,
    allAttendance: attendance,
    totalPages,
  } = useSelector((state) => state.attendance);

    const { employees } = useSelector(
    (state) => state.admin
  );

  // DRAFT FILTER STATE (UI)
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");

  // APPLIED FILTER STATE (API)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedTeam, setAppliedTeam] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  // DEBOUNCE SEARCH (UI only)
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // API CALL — ONLY applied filters
  useEffect(() => {
    if (token) {
      dispatch(
        allAttendance({
          token,
          pageNo: currentPage,
          search: appliedSearch,
          teamFilter: appliedTeam,
          statusFilter: appliedStatus,
          startDate: appliedFrom,
          endDate: appliedTo,
        })
      );
    }
  }, [
    dispatch,
    token,
    currentPage,
    appliedSearch,
    appliedTeam,
    appliedStatus,
    appliedFrom,
    appliedTo,
  ]);

  const records = attendance?.attendance || [];

  // FILTER ACTIONS
  const handleApplyFilters = () => {
    setAppliedSearch(debouncedSearch);
    setAppliedTeam(teamFilter === "all" ? "" : teamFilter.toLowerCase());
    setAppliedStatus(statusFilter === "all" ? "" : statusFilter);
    setAppliedFrom(fromFilter);
    setAppliedTo(toFilter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setTeamFilter("all");
    setStatusFilter("all");
    setFromFilter("");
    setToFilter("");

    setAppliedSearch("");
    setAppliedTeam("");
    setAppliedStatus("");
    setAppliedFrom("");
    setAppliedTo("");

    setCurrentPage(1);
  };

  const hasActiveFilters =
    !!appliedSearch ||
    !!appliedTeam ||
    !!appliedStatus ||
    !!appliedFrom ||
    !!appliedTo;

  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Attendance Records
      </h3>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">Search</label>
          <input
            type="text"
            className="border px-3 py-2 rounded-md text-sm"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">Status</label>
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="On Time">On-Time</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">Team</label>
          <select
            className="border px-3 py-2 rounded-md text-sm"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="all">All Teams</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-md text-sm"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            className="border px-3 py-2 rounded-md text-sm"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
          />
        </div>
      </div>

      {/* FILTER ACTIONS */}
      <FilterActions
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        isApplyDisabled={
          debouncedSearch === appliedSearch &&
          (teamFilter === "all" ? "" : teamFilter.toLowerCase()) === appliedTeam &&
          (statusFilter === "all" ? "" : statusFilter) === appliedStatus &&
          fromFilter === appliedFrom &&
          toFilter === appliedTo
        }
        isResetDisabled={!hasActiveFilters}
        loading={loading}
      />

      {/* EMPTY STATE */}
      {!loading && records.length === 0 && (
        <p className="text-gray-500">No attendance records found</p>
      )}

      {/* TABLE */}
      {records.length > 0 && (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              Loading...
            </div>
          )}

          <table className="table-auto min-h-[300px] w-full border border-gray-300 rounded-xl">
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
              {records.map((emp) => (
                <tr key={emp._id} className="border-b text-sm">
                  <td className="px-4 py-3">
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
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-6">
          <button
            disabled={loading || currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              disabled={loading}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={loading || currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAttendancePage;
