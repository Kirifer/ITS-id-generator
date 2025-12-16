import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Contact, NotebookText, Loader } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { logoutStore } from "../store/authStore";

export default function Sidebar({ expanded, onMouseEnter, onMouseLeave }) {
  const { logout, loading, success, error, message, reset } = logoutStore();
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (success) {
      // remove role from localStorage on logout
      localStorage.removeItem("role");
      reset();
      navigate("/login", { replace: true });
    }
    if (error) {
      console.error(message);
    }
  }, [success, error, message, navigate, reset]);

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${expanded ? "w-60" : "w-20"} bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
    >
      <div className="space-y-6">
        <SidebarLogo expanded={expanded} />
        <SidebarNav expanded={expanded} role={role} />
      </div>
      <SidebarFooter
        expanded={expanded}
        handleLogout={handleLogout}
        loading={loading}
      />
    </aside>
  );
}

function SidebarLogo({ expanded }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="w-8 h-8" />
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? "opacity-100 w-auto" : "opacity-0 w-0"} text-xl font-bold`}
      >
        IT Squarehub
      </span>
    </div>
  );
}

function SidebarNav({ expanded, role }) {
  const navItems = [
    { to: "/dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
    { to: "/id-generator", icon: <Contact size={20} />, label: "ID Generator" },
    { to: "/generated-ids", icon: <NotebookText size={20} />, label: "Generated IDs" },
  ];

  if (role === "Approver") {
    navItems.splice(0, navItems.length,
      { to: "/approver-dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
      { to: "/approver-generated-ids", icon: <NotebookText size={20} />, label: "Generated IDs" }
    );
  }

  return (
    <nav className="space-y-3">
      {navItems.map(({ to, icon, label }) => (
        <NavItem key={to} to={to} icon={icon} label={label} expanded={expanded} />
      ))}
    </nav>
  );
}

function SidebarFooter({ expanded, handleLogout, loading }) {
  return (
    <div className="pt-6 border-t border-gray-600">
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
        ${loading ? "bg-gray-500 cursor-not-allowed" : "hover:text-purple-400"}`}
        disabled={loading}
      >
        {loading ? (
          <span>
            <Loader className="animate-spin" />
          </span>
        ) : (
          <FaSignOutAlt />
        )}
        <span className={expanded ? "" : "sr-only"}>Logout</span>
      </button>
    </div>
  );
}

function NavItem({ icon, label, to, expanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
         ${isActive ? "bg-[#3E3862] text-white" : "hover:text-purple-400"}`
      }
    >
      {icon}
      <span className={expanded ? "" : "sr-only"}>{label}</span>
    </NavLink>
  );
}
