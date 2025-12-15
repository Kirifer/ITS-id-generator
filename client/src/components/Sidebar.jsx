import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Contact, NotebookText } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function Sidebar({ expanded, onMouseEnter, onMouseLeave }) {
  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${expanded ? 'w-60' : 'w-20'} bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
    >
      <div className="space-y-6">
        <SidebarLogo expanded={expanded} />
        <SidebarNav expanded={expanded} />
      </div>
      <SidebarFooter expanded={expanded} />
    </aside>
  );
}

function SidebarLogo({ expanded }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Logo" className="w-8 h-8" />
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} text-xl font-bold`}>
        IT Squarehub
      </span>
    </div>
  );
}

function SidebarNav({ expanded }) {
  return (
    <nav className="space-y-3">
      <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" expanded={expanded} />
      <NavItem to="/id-generator" icon={<Contact size={20} />} label="ID Generator" expanded={expanded} />
      <NavItem to="/generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" expanded={expanded} />
    </nav>
  );
}

function SidebarFooter({ expanded }) {
  return (
    <div className="pt-6 border-t border-gray-600">
      <NavItem to="/logout" icon={<FaSignOutAlt />} label="Logout" expanded={expanded} />
    </div>
  );
}

function NavItem({ icon, label, to, expanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
         ${isActive ? 'bg-[#3E3862] text-white' : 'hover:text-purple-400'}`
      }
    >
      {icon}
      <span className={expanded ? '' : 'sr-only'}>{label}</span>
    </NavLink>
  );
}
