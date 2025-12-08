import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEmployees } from "../redux/slices/AdminSlice";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const dispatch = useDispatch();

  const { loading, token, employees } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getEmployees(token));
  }, [dispatch, token]);

  return (
    <div className="flex p-10 flex-col border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800">Employee List</h3>

      {loading && <p>Loading...</p>}
      {!loading && employees?.length === 0 && (
        <p>No employees found</p>
      )}

      {!loading && employees?.length > 0 && (
        <table className="table-auto w-full border border-gray-300 rounded-xl border-separate">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm p-3">
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
                <Link to="/employeeProfile" className="p-3 text-gray-800">{emp.fullname}</Link>
                <td className="px-4 py-2 text-gray-600">{emp.email}</td>
                <td className="px-4 py-2 text-gray-600">{emp.designation}</td>
                <td className="px-4 py-2 text-gray-600">{emp.employeeCode}</td>
                <td className="px-4 py-2 text-gray-600">{emp.team || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{emp.dob || "-"}</td>
                <td className="px-4 py-2 text-gray-600">{emp.subrole || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
