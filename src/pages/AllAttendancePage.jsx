import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAttendance } from "../redux/slices/AttendanceSlice";

const AllAttendancePage = () => {
  const dispatch = useDispatch();

  const { loading, token, allAttendance: attendanceList } = useSelector(
    (state) => state.attendance
  );

  // Filter / Sort state
  const [sortBy, setSortBy] = useState("date");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(allAttendance(token));
    }
  }, [dispatch, token]);

  // Filtered + Sorted data
  const filteredAttendance = useMemo(() => {
    let data = [...(attendanceList || [])];

  // DATE FILTER
if (selectedDate) {
  data = data.filter((item) => {
    if (!item.punchDate) return false;

    return (
      new Date(item.punchDate).toLocaleDateString("en-CA") === selectedDate
    );
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

    // Sort
    if (sortBy === "date") {
      data.sort(
        (a, b) => new Date(b.punchDate) - new Date(a.punchDate)
      );
    }

    return data;
  }, [attendanceList, sortBy, statusFilter, teamFilter, selectedDate]);

  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Attendance Records
      </h3>

      {/*FILTER BAR */}
      <div className="flex gap-4 mb-6 justify-between">
        {/* Sort */}
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
 

        {/* Status Filter */}
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


        {/* Team Filter */}
        <div className="flex flex-col w-64">
        <label className="text-gray-600">
          Team
        <select
          className="border px-3 py-2 w-full  rounded-md text-sm"
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

      {/* Loader */}
      {loading && <p>Loading...</p>}

      {/* No data */}
      {!loading && filteredAttendance.length === 0 && (
        <p>No attendance records found</p>
      )}

      {/* Attendance Table */}
      {!loading && filteredAttendance.length > 0 && (
        <table className="table-auto w-full border border-gray-300 rounded-xl border-separate">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-2">Date</th>
              <th className="p-2">Employee Name</th>
              <th className="p-2">Team</th>
              <th className="p-2">Arrival Time</th>
              <th className="p-2">Leaving Time</th>
              <th className="p-2">Working Hours</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAttendance.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="px-4 py-2 text-gray-600">
                  {emp.punchDate
                    ? new Date(emp.punchDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.employee?.fullName || emp.employee?.fullname || "N/A"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.employee?.team || "N/A"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.punchInTime || "-"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.leavingTime || "-"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.workingHours || "-"}
                </td>

                <td className="px-4 py-2 text-gray-600">
                  {emp.punctualStatus || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAttendancePage;
