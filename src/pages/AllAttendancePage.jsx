import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAttendance } from "../redux/slices/AttendanceSlice";

const AllAttendancePage = () => {
  const dispatch = useDispatch();

  const { loading, token, allAttendance: attendanceList } = useSelector(
    (state) => state.attendance
  );

  // console.log("ATTENDANCE DATA:", attendanceList);

  useEffect(() => {
    if (token) {
      dispatch(allAttendance(token));
    }
  }, [dispatch, token]);

  return (
    <div className="flex p-20 flex-col border border-gray-200 rounded-xl mt-10 bg-white">

      <h3 className="text-2xl mb-6 text-gray-800 font-semibold">
        Attendance Records
      </h3>

      {/* Loader */}
      {loading && <p>Loading...</p>}

      {/* No data */}
      {!loading && attendanceList?.length === 0 && (
        <p>No attendance records found</p>
      )}

      {/* Attendance Table */}
      {!loading && attendanceList?.length > 0 && (
        <table className="table-auto w-full border border-gray-300 rounded-xl border-separate">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm p-3">
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
            {attendanceList.map((emp) => (
              <tr key={emp._id} className="border-b">
                
                {/* Date */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.punchDate
                    ? new Date(emp.punchDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* Employee Name */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.employee?.fullName || emp.employee?.fullname || "N/A"}
                </td>

                {/* Team */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.employee?.team || "N/A"}
                </td>

                {/* Arrival */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.punchInTime || "-"}
                </td>

                {/* Leaving */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.leavingTime || "-"}
                </td>

                {/* Hours */}
                <td className="px-4 py-2 text-gray-600">
                  {emp.workingHours || "-"}
                </td>

                {/* Status */}
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
