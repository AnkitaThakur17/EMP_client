import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createEmployee } from "../redux/slices/AdminSlice";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

// DATE PICKER IMPORTS
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token } = useSelector((state) => state.admin);

  const [error, setError] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const initialFormState = {
    fullname: "",
    email: "",
    password: "",
    designation: "",
    team: "",
    employeeCode: "",
    dob: null,
    subrole: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // ===== VALIDATION =====
  const validateField = (name, value) => {
    let err = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) err = "Full name is required";
        else if (value.length < 3)
          err = "Name must be at least 3 characters long";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) err = "Invalid email";
        break;
      case "password":
        if (value.length < 6)
          err = "Password must be at least 6 characters long";
        break;
      case "designation":
        if (!value.trim()) err = "Designation required";
        break;
      case "team":
        if (!value.trim()) err = "Team is required";
        break;
      case "employeeCode":
        if (value.length < 2) err = "Invalid employee code";
        break;
      case "dob":
        if (!value) err = "DOB required";
        break;
      case "subrole":
        if (!value.trim()) err = "Subrole is required";
        break;
    }

    setError((prev) => ({
      ...prev,
      [name]: err,
    }));

    return err;
  };

  // ===== HANDLE INPUT CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  // ===== HANDLE DATE PICKER CHANGE =====
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
    validateField("dob", date);
  };

  // ===== HANDLE FORM SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError({});
    setSuccessMsg("");

    // Validate all fields
    let hasError = false;
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) hasError = true;
    });

    if (hasError) return; // stop submission if validation fails

    try {
      const result = await dispatch(
        createEmployee({
          employeeData: formData,
          token,
        })
      );

      if (createEmployee.fulfilled.match(result)) {
        setSuccessMsg("Employee created successfully!");

        // Reset the form completely
        setFormData(initialFormState);

        // Clear field errors
        setError({});

        // Auto hide success message after 3 sec
        setTimeout(() => setSuccessMsg(""), 3000);

        // Optional: redirect after 1 sec
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError({ form: result.payload || "Something went wrong" });
      }
    } catch (err) {
      setError({ form: err.message || "Submission failed" });
    }
  };

  return (
    <div className="flex p-20 flex-col items-center border border-gray-200 rounded-xl mt-10 bg-white">
      <h3 className="text-2xl mb-6 text-gray-800">Employee Account</h3>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* FULLNAME + EMAIL */}
        <div className="flex flex-row gap-5">
          <div className="w-full">
            <input
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mb-1 text-gray-800 focus:border-blue-500 outline-none"
            />
            {error.fullname && (
              <p className="text-red-500 text-sm">{error.fullname}</p>
            )}
          </div>

          <div className="w-full">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mb-1 text-gray-800 focus:border-blue-500 outline-none"
            />
            {error.email && (
              <p className="text-red-500 text-sm">{error.email}</p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-gray-200 rounded-md px-3 py-2 mt-4 text-gray-800 focus:border-blue-500 outline-none"
        />
        {error.password && (
          <p className="text-red-500 text-sm">{error.password}</p>
        )}

        {/* DESIGNATION + TEAM */}
        <div className="flex flex-row gap-5">
          <div className="w-full">
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mt-4 text-gray-800 focus:border-blue-500 outline-none"
            />
            {error.designation && (
              <p className="text-red-500 text-sm">{error.designation}</p>
            )}
          </div>

          <div className="w-full">
            <input
              name="team"
              value={formData.team}
              onChange={handleChange}
              placeholder="Team"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mt-4 text-gray-800 focus:border-blue-500 outline-none"
            />
            {error.team && <p className="text-red-500 text-sm">{error.team}</p>}
          </div>
        </div>

        {/* EMPLOYEE CODE */}
        <input
          name="employeeCode"
          value={formData.employeeCode}
          onChange={handleChange}
          placeholder="Employee code"
          className="w-full border border-gray-200 rounded-md px-3 py-2 mt-4 text-gray-800 focus:border-blue-500 outline-none"
        />
        {error.employeeCode && (
          <p className="text-red-500 text-sm">{error.employeeCode}</p>
        )}

        {/* DOB + SUBROLE */}
        <div className="flex flex-row gap-5 justify-between mt-4">
          {/* DOB (DATE PICKER) */}
          <div className="w-full">
            <div className="border border-gray-200 rounded-md px-3 py-[6px] flex items-center justify-between focus-within:border-blue-500">

              {/* <DatePicker */}
              <DatePicker
                onChange={handleDateChange}
                value={formData.dob}
                format="dd-MM-yy"
                clearIcon={null}
                calendarIcon={<Calendar size={20} className="text-gray-600" />}
                dayPlaceholder="DD"
                monthPlaceholder="MM"
                yearPlaceholder="YYYY"
                className="w-full !border-none !p-0 !outline-none !shadow-none bg-transparent text-gray-800"
              />
            </div>
            {error.dob && <p className="text-red-500 text-sm">{error.dob}</p>}
          </div>

          {/* SUBROLE */}
          <div className="w-full">
            <select
              name="subrole"
              value={formData.subrole}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-400 bg-white focus:border-blue-500 outline-none"
            >
              <option value="">Select subrole</option>
              <option value="HR">HR</option>
              <option value="TL">TL</option>
              <option value="none">None</option>
            </select>
            {error.subrole && (
              <p className="text-red-500 text-sm">{error.subrole}</p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 mt-4 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>

        {/* SUCCESS / FORM ERROR MESSAGE */}
        {successMsg && (
          <p className="text-green-600 mt-2 text-sm font-bold">{successMsg}</p>
        )}
        {error.form?.message && (
          <p className="text-red-600 text-sm font-bold">{error.form.message}</p>
        )}
        {/* {error.form && <p className="text-red-600 mt-2 text-sm font-bold">{error.form}</p>} */}
      </form>
    </div>
  );
};

export default CreateEmployee;
