import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees } from "../redux/slices/AdminSlice";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const dispatch = useDispatch();

  const [selectedName, setSelectedName] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");

  const { loading, token, employees } = useSelector(
    (state) => state.admin
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (token) {
      dispatch(getEmployees(token));
    }
  }, [dispatch, token]);

  // FILTER
  const filteredEmployees = useMemo(() => {
    let data = [...(employees || [])];

    // Name filter
    if (selectedName.trim()) {
      const search = selectedName.toLowerCase();
      data = data.filter(
        (item) =>
          item.fullname &&
          item.fullname.toLowerCase().includes(search)
      );
    }

    // Team filter
    if (teamFilter !== "all") {
      data = data.filter(
        (item) => item.team === teamFilter
      );
    }

    return data;
  }, [employees, selectedName, teamFilter]);

  //pagination after filter
  const paginatedEmployee = useMemo(()=>{
        const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex)

  },[filteredEmployees, currentPage])

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  //Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedName,teamFilter]);


  return (
    <div className="flex p-10 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl text-gray-800">
          Employee List
        </h3>

        <Link
          to="/create-employee"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Create Employee
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        {/* Name Filter */}
        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            className="border px-3 py-2 w-full rounded-md text-sm"
            placeholder="Search by name"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          />
        </div>

        {/* Team Filter */}
        <div className="flex flex-col w-64">
          <label className="text-gray-600 mb-1">
            Team
          </label>
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
        </div>
      </div>

      {/* STATES */}
      {loading && <p>Loading...</p>}

      {!loading && filteredEmployees.length === 0 && (
        <p className="text-gray-500">
          No employees found
        </p>
      )}

      {/* TABLE */}
      {!loading && filteredEmployees.length > 0 && (
        <table className="table-auto w-full border border-gray-300 rounded-xl border-separate">
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
            {filteredEmployees.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="p-3 text-gray-800">
                  <Link
                    to="/employeeProfile"
                    className="text-indigo-600 hover:underline"
                  >
                    {emp.fullname}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.email}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.designation}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.employeeCode}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.team || "-"}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.dob ? new Date(emp.dob).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) : "-"}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {emp.subrole || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
