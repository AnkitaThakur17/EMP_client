import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees, updateEmployee } from "../redux/slices/AdminSlice";
import { Link } from "react-router-dom";
import FilterActions from "../components/FilterActions";
import { SquarePen } from "lucide-react";
import { Calendar } from "lucide-react";
// DATE PICKER IMPORTS
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const EmployeeList = () => {
  const dispatch = useDispatch();

  // Draft filter state (UI only)
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  // Applied filter state (API only)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedTeam, setAppliedTeam] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { loading, token, employees, totalPages } = useSelector(
    (state) => state.admin
  );

  // Edit employee
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    designation: "",
    employeeCode: "",
    team: "",
    dob: "",
    subrole: ""
  });

  // Prefill the modal form data when selectedEmployee changes
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        fullname: selectedEmployee.fullname || "",
        email: selectedEmployee.email || "",
        designation: selectedEmployee.designation || "",
        employeeCode: selectedEmployee.employeeCode || "",
        team: selectedEmployee.team || "",
        dob: selectedEmployee.dob || "",
        subrole: selectedEmployee.subrole || ""
      });
    }
  }, [selectedEmployee]);

  // Generic handleChange for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Edit button click
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  // Save updated employee
  const handleUpdateEmployee = () => {
    dispatch(
      updateEmployee({
        token,
        userId: selectedEmployee._id,
        userData: formData,
      })
    ).then(() => {
      setIsEditOpen(false);
      setSelectedEmployee(null);
    });
  };

  // Debounce search (UI only)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // API CALL (only applied filters)
  useEffect(() => {
    if (token) {
      dispatch(
        getEmployees({
          token,
          pageNo: currentPage,
          search: appliedSearch,
          teamFilter: appliedTeam,
        })
      );
    }
  }, [dispatch, token, currentPage, appliedSearch, appliedTeam]);

  // FILTER ACTIONS
  const handleApplyFilters = () => {
    setAppliedSearch(debouncedSearch);
    setAppliedTeam(teamFilter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setTeamFilter("");
    setAppliedSearch("");
    setAppliedTeam("");
    setCurrentPage(1);
  };

  // ===== HANDLE DATE PICKER CHANGE =====
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
    validateField("dob", date);
  };

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
      <div className="flex gap-4 mb-4">
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

      {/* FILTER ACTIONS */}
      <FilterActions
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        isApplyDisabled={
          debouncedSearch === appliedSearch && teamFilter === appliedTeam
        }
        isResetDisabled={!appliedSearch && !appliedTeam}
        loading={loading}
      />

      {/* EMPTY STATE */}
      {!loading && employees.length === 0 && (
        <p className="text-gray-500 mt-6">No employees found</p>
      )}

      {/* TABLE */}
      {employees.length > 0 && (
        <div className="relative mt-6">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              Loading...
            </div>
          )}

          <table className="table-auto w-full min-h-[40px] border border-gray-300 rounded-xl text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-2">Employee Name</th>
                <th className="p-2">Email Id</th>
                <th className="p-2">Designation</th>
                <th className="p-2">Employee Code</th>
                <th className="p-2">Team</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Subrole</th>
                <th className="p-2">Edit</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="p-2 text-gray-800">
                    <Link
                      to="/employeeProfile"
                      className="text-indigo-600 hover:underline"
                    >
                      {emp.fullname}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.designation}</td>
                  <td className="px-4 py-2">{emp.employeeCode}</td>
                  <td className="px-4 py-2">{emp.team || "-"}</td>
                  <td className="px-4 py-2">
                    {emp.dob
                      ? new Date(emp.dob).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{emp.subrole || "-"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="p-1 hover:text-blue-600"
                    >
                      <SquarePen size={20} className="text-gray-600 shrink-0" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
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

      {/* EDIT MODAL */}
      {isEditOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Edit Employee ( {formData.fullname} ) </h2>
            <h5>{formData.ful}</h5>
            <div className="flex flex-col gap-2">
              <label className="text-blue-400">Fullname</label>
              <input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="border px-3 py-1 rounded border border-gray-400 outline-none"
              />
              <label className="text-blue-400">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border px-3 py-1 rounded border border-gray-400 outline-none"
              />
              <label className="text-blue-400">Designation</label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="border px-3 py-1 rounded border border-gray-400 outline-none"
              />
              <label className="text-blue-400">Employee code</label>
              <input
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                placeholder="Employee Code"
                className="border px-3 py-1 rounded border border-gray-400 outline-none"
              />
              <label className="text-blue-400">Team</label>
              <input
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="Team"
                className="border px-3 py-1 rounded border border-gray-400 outline-none"
              />
              <label className="text-blue-400">DOB</label>
              <DatePicker
                onChange={handleDateChange}
                value={formData.dob}
                format="dd-MM-yy"
                clearIcon={null}
                calendarIcon={<Calendar size={20} className="text-gray-600" />}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                className="w-full border border-gray-400 bg-transparent text-gray-800 p-1 rounded-md"
              />
              <label className="text-blue-400">Subrole</label>
              <select
              name="subrole"
              value={formData.subrole}
              onChange={handleChange}
              className="w-full border border-gray-400 outline-none rounded-md px-3 py-2 text-gray-400 bg-white focus:border-blue-500 "
            >
              <option value="">Select subrole</option>
              <option value="HR">HR</option>
              <option value="TL">TL</option>
              <option value="none">None</option>
            </select>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateEmployee}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;