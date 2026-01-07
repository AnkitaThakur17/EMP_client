import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { allAttendance,getLateAttendance } from "../redux/slices/AttendanceSlice"
import { getEmployees } from "../redux/slices/AdminSlice"

const AdminDashboard = () => {
const dispatch = useDispatch()

const{
count: attendanceCount,
lateCount
} = useSelector((state)=>state.attendance)

const{
   count: empCount
} = useSelector((state)=>state.admin)

const today = new Date().toISOString().split("T")[0];

useEffect(()=>{
    dispatch(
        allAttendance({
            startDate: today,
            endDate: today,
        })
    )
},[dispatch, today])

useEffect(()=>{
    dispatch(
       getLateAttendance({
         isLateList : true
        })
    )
},[dispatch])


useEffect(()=>{
    dispatch(
       getEmployees({
        
        })
    )
},[dispatch])

  return (
<>
    <div className="p-10  bg-white border border-gray-200 rounded-xl mt-10 shadow-sm">
     <h1 className="font-bold text-2xl">Welcome Admin !!</h1>

    <div className="flex gap-5 items-center flex-row">

    <div className="md:w-1/2 p-5 border border-gray-200 rounded-xl mt-10 shadow-sm w-auto">
    <h1 className="font-bold">Total Employees</h1>
    <h5 className="">Employees : <span style={{ color: "blue", fontWeight: "600" }}>
    {empCount}
  </span> </h5>
    </div>
        <div className="md:w-1/2 p-5 border border-gray-200 rounded-xl mt-10 shadow-sm w-auto">
    <h1 className="font-bold">Today's Attendance</h1>
    <h5 className="">Employees Present today : <span style={{ color: "green", fontWeight: "600" }}>
    {attendanceCount}
  </span> </h5>
    </div>

    <div className="md:w-1/2 p-5 border border-gray-200 rounded-xl mt-10 shadow-sm w-auto">
    <h1 className="font-bold">Today's Attendance</h1>
    <h5 className="">Employees Late today :   <span style={{ color: "red", fontWeight: "600" }}>
    {lateCount}
  </span> </h5>
    </div>
</div>
    </div>
</>
  )
}

export default AdminDashboard 