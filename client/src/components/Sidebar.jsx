import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Contact,
  NotebookText,
  Loader,
  Users,
  Plus,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { logoutStore, authCheckStore } from "../store/authStore";

export default function Sidebar({ expanded, onMouseEnter, onMouseLeave }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const {
    logout,
    loading,
    success,
    error,
    message: logoutMsg,
    reset,
  } = logoutStore();
  const { message: authData } = authCheckStore();
  const navigate = useNavigate();

  const userRole = authData?.role;

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (success) {
      reset();
      navigate("/login", { replace: true });
    }
    if (error) {
      console.error(logoutMsg);
    }
  }, [success, error, logoutMsg, navigate, reset]);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#262046] text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`${
          expanded ? "lg:w-60" : "lg:w-20"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static w-60 bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300 z-40`}
      >
        <div className="space-y-6">
          <SidebarLogo expanded={expanded} mobileOpen={mobileOpen} />
          <SidebarNav
            expanded={expanded}
            role={userRole}
            mobileOpen={mobileOpen}
            onLinkClick={() => setMobileOpen(false)}
          />
        </div>
        <SidebarFooter
          expanded={expanded}
          handleLogout={handleLogout}
          loading={loading}
          mobileOpen={mobileOpen}
        />
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}

function SidebarNav({ expanded, role, mobileOpen, onLinkClick }) {
  let navItems = [];

  if (role === "Admin") {
    navItems = [
      { to: "/dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
      {
        to: "/id-generator",
        icon: <Contact size={20} />,
        label: "ID Generator",
      },
      {
        to: "/generated-ids",
        icon: <NotebookText size={20} />,
        label: "Generated IDs",
      },
      {
        to: "/hr-management",
        icon: <Users size={20} />,
        label: "HR Management",
      },
      {
        to: "/admin",
        icon: <Shield size={20} />,
        label: "User Management",
      },
      {
        to: "/positions",
        icon: <Plus size={20} />,
        label: "Add Position",
      },
    ];
  } else if (role === "Approver") {
    navItems = [
      {
        to: "/approver-dashboard",
        icon: <LayoutGrid size={20} />,
        label: "Dashboard",
      },
      {
        to: "/approver-generated-ids",
        icon: <NotebookText size={20} />,
        label: "Generated IDs",
      },
    ];
  }

  return (
    <nav className="space-y-3">
      {navItems.map(({ to, icon, label }) => (
        <NavItem
          key={to}
          to={to}
          icon={icon}
          label={label}
          expanded={expanded}
          mobileOpen={mobileOpen}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  );
}

function SidebarLogo({ expanded, mobileOpen }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="w-8 h-8" />
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          expanded || mobileOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
        } text-xl font-bold`}
      >
        IT Squarehub
      </span>
    </div>
  );
}

function SidebarFooter({ expanded, handleLogout, loading, mobileOpen }) {
  return (
    <div className="pt-6 border-t border-gray-600">
      <button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
        ${
          loading ? "bg-gray-500 cursor-not-allowed" : "hover:text-purple-400"
        }`}
        disabled={loading}
      >
        {loading ? (
          <Loader className="animate-spin" size={18} />
        ) : (
          <FaSignOutAlt />
        )}
        <span className={expanded || mobileOpen ? "block" : "hidden"}>
          Logout
        </span>
      </button>
    </div>
  );
}

function NavItem({ icon, label, to, expanded, mobileOpen, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
         ${isActive ? "bg-[#3E3862] text-white" : "hover:text-purple-400"}`
      }
    >
      {icon}
      <span className={expanded || mobileOpen ? "block" : "hidden"}>
        {label}
      </span>
    </NavLink>
  );
}