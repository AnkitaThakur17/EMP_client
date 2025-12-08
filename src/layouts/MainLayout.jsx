import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import EmployeeSidebar from "../components/EmployeeSidebar";

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);

  const [expanded, setExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100 p-10">

      {/* Sidebar */}
      {user && (
        <>
          {user.role === "admin" && (
            <AdminSidebar expanded={expanded} setExpanded={setExpanded} isLocked = {isLocked} setIsLocked = {setIsLocked}/>
          )}
          {user.role === "employee" && (
            <EmployeeSidebar expanded={expanded} setExpanded={setExpanded} isLocked = {isLocked} setIsLocked = {setIsLocked}/>
          )}
        </>
      )}

      {/* RIGHT SIDE CONTAINER */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
          ${expanded || isLocked ? "ml-64" : "ml-20"}
        `}
      >
        <Navbar expanded= {expanded} isLocked= {isLocked} setIsLocked= {setIsLocked}/>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
