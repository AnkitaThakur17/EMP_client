import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees } from "../redux/slices/AdminSlice";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const dispatch = useDispatch();

  // Filters (only UI state)
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, token, employees, totalPages, pageNo, limit } = useSelector(
    (state) => state.admin
  );

  // Fetch employees from backend
  useEffect(() => {
    if (token) {
      dispatch(
        getEmployees({
          token,
          pageNo,
          limit,
          search,
          teamFilter: teamFilter === "all" ? "" : teamFilter,
        })
      );
    }
  }, [dispatch, token, currentPage, search, teamFilter]);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, teamFilter]);

  return (
    <div className="flex p-10 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl text-gray-800">Employee List</h3>

        <Link
          to="/create-employee"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Create Employee
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">Search</label>
          <input
            type="text"
            className="border px-3 py-2 w-full rounded-md text-sm"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Team Filter */}
        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">Team</label>
          <select
            className="border px-3 py-2 w-full rounded-md text-sm"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {/* STATES */}
      {loading && <p>Loading...</p>}

      {!loading && employees.length === 0 && (
        <p className="text-gray-500">No employees found</p>
      )}

      {/* TABLE */}
      {!loading && employees.length > 0 && (
        <>
          <table className="table-auto w-full border border-gray-300 rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-2">Employee Name</th>
                <th className="p-2">Email Id</th>
                <th className="p-2">Designation</th>
                <th className="p-2">Employee Code</th>
                <th className="p-2">Team</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Subrole</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="p-3 text-gray-800">
                    <Link
                      to="/employeeProfile"
                      className="text-indigo-600 hover:underline"
                    >
                      {emp.fullname}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{emp.email}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.designation}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.employeeCode}</td>
                  <td className="px-4 py-2 text-gray-600">{emp.team || "-"}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {emp.dob
                      ? new Date(emp.dob).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{emp.subrole || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded-md disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
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
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeList;
