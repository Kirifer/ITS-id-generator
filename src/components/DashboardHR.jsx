import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  FaTh,
  FaIdCard,
  FaSignOutAlt,
  FaUserCheck,
  FaClipboardList,
  FaTasks,
  FaChevronDown,
  FaSearch
} from 'react-icons/fa';

import logo from '../assets/images/logo.png';
import frontID from '../assets/images/1 FRONT.png';
import backID from '../assets/images/1 BACK.png';

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sidebarHover, setSidebarHover] = useState(false);

  const idData = [
    { firstName: 'Emily',   middleInitial: 'A', lastName: 'Tan',    type: 'Intern',   status: 'Pending',  date: '05/02/2025' },
    { firstName: 'David',   middleInitial: 'M', lastName: 'Cruz',   type: 'Employee', status: 'Approved', date: '11/15/2023' },
    { firstName: 'Sarah',   middleInitial: 'J', lastName: 'Lopez',  type: 'Intern',   status: 'Pending',  date: '07/21/2024' },
    { firstName: 'Michael', middleInitial: 'K', lastName: 'Reyes',  type: 'Employee', status: 'Approved', date: '01/05/2023' },
    { firstName: 'Jessica', middleInitial: 'L', lastName: 'Gomez',  type: 'Employee', status: 'Approved', date: '03/18/2022' },
    { firstName: 'Brian',   middleInitial: 'D', lastName: 'Santos', type: 'Intern',   status: 'Pending',  date: '09/14/2024' },
    { firstName: 'Olivia',  middleInitial: 'E', lastName: 'Lim',    type: 'Employee', status: 'Approved', date: '04/09/2023' },
    { firstName: 'Daniel',  middleInitial: 'P', lastName: 'Chua',   type: 'Employee', status: 'Approved', date: '02/27/2024' },
    { firstName: 'Sophia',  middleInitial: 'H', lastName: 'Rivera', type: 'Intern',   status: 'Pending',  date: '06/11/2024' },
    { firstName: 'Anthony', middleInitial: 'F', lastName: 'Diaz',   type: 'Employee', status: 'Approved', date: '12/30/2022' }
  ];

  const filteredData = idData.filter((id) => {
    const fullName = `${id.firstName} ${id.middleInitial}. ${id.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || id.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleSelectId = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const previewMounted = Boolean(selectedId) && !sidebarHover;
  const sidebarExpanded = !selectedId || sidebarHover;

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className={`${
          selectedId && !sidebarHover ? 'w-20' : 'w-60'
        } bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              } text-xl font-bold`}
            >
              IT Squarehub
            </span>
          </div>
          <nav className="space-y-3">
            <NavItem to="/dashboardhr" icon={<FaTh />} label="Dashboard" sidebarExpanded={sidebarExpanded} />
            <NavItem to="/approvalhr" icon={<FaIdCard />} label="Generated IDs" sidebarExpanded={sidebarExpanded} />
          </nav>
        </div>
        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/login" icon={<FaSignOutAlt />} label="Logout" sidebarExpanded={sidebarExpanded} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300 custom-bg flex flex-col overflow-hidden">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />} label="Total Generated IDs" count={filteredData.length} />
          <StatCard icon={<FaUserCheck size={50} />} label="Approved" count={filteredData.filter(i => i.status === 'Approved').length} />
          <StatCard icon={<FaClipboardList size={50} />} label="Pending" count={filteredData.filter(i => i.status === 'Pending').length} />
          <StatCard icon={<FaTasks size={50} />} label="Actions" count={58} />
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden transition-all duration-500"
          style={{ marginRight: previewMounted ? '600px' : '0' }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
            <div className="flex gap-4 flex-wrap items-center">
              <Dropdown options={['All', 'Intern', 'Employee']} label="Type" value={typeFilter} onChange={setTypeFilter} />
              <Dropdown options={['All', 'Approved', 'Pending']} label="Status" value={statusFilter} onChange={setStatusFilter} />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="border border-gray-300 rounded-lg pl-8 pr-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden rounded-2xl custom-scrollbar">
            <div className="flex-1 overflow-auto">
              <table className="min-w-full text-sm text-center border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[#D0CAF3] text-gray-800 font-extrabold">
                  <tr>
                    <th className="p-4 rounded-tl-2xl">Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date Generated</th>
                    <th className="p-4 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((id, index) => {
                    const idKey = `${id.firstName}-${id.middleInitial}-${id.lastName}-${id.date}`;
                    const selectedKey = selectedId ? `${selectedId.firstName}-${selectedId.middleInitial}-${selectedId.lastName}-${selectedId.date}` : null;
                    const isSelected = idKey === selectedKey;

                    return (
                      <tr
                        key={index}
                        className={`transition-colors duration-200 cursor-pointer ${
                          isSelected ? 'bg-purple-200' : 'bg-white even:bg-gray-100 hover:bg-purple-50'
                        }`}
                        onClick={() => toggleSelectId(id)}
                      >
                        <td className="p-4">{`${id.firstName} ${id.middleInitial}. ${id.lastName}`}</td>
                        <td className="p-4">{id.type}</td>
                        <td className="p-4">{id.status}</td>
                        <td className="p-4">{id.date}</td>
                        <td className="p-4 flex items-center justify-center gap-3">
                          <Eye
                            size={16}
                            className={`transition-colors duration-200 ${
                              isSelected ? 'text-purple-800' : 'text-purple-600 hover:text-purple-800'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-gray-500 italic">No matching results.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewMounted && selectedId && (
          <div className="fixed top-1/2 right-6 -translate-y-1/2 w-[580px] max-h-[90vh] rounded-2xl p-4 z-50 flex flex-col items-center bg-transparent overflow-y-auto transition-all duration-500">
            <div className="flex justify-end w-full mb-2">
              <button
                onClick={() => setSelectedId(null)}
                className="text-gray-600 hover:text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-3 rounded-xl flex justify-center gap-4 bg-white shadow-lg">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700 mb-1">Front</p>
                <img src={frontID} alt="Front ID" className="object-contain w-[140px]" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700 mb-1">Back</p>
                <img src={backID} alt="Back ID" className="object-contain w-[140px]" />
              </div>
            </div>

            <div className="w-full mt-4 space-y-4">
              <div className="bg-white p-3 rounded-lg shadow text-sm">
                <p className="font-semibold mb-1">Generated by:</p>
                <p>Janssen Gundran</p>
                <p className="text-gray-500">janssen@gmail.com</p>
              </div>
              {selectedId.status === 'Approved' && (
                <div className="bg-white p-3 rounded-lg shadow text-sm">
                  <p className="font-semibold mb-1">Approved by:</p>
                  <p>Christian Elagio</p>
                  <p className="text-gray-500">christian@gmail.com</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function NavItem({ icon, label, to, sidebarExpanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-1 rounded-md hover:text-purple-400 ${
          isActive ? 'text-purple-400 font-semibold' : ''
        } justify-start`
      }
    >
      {icon}
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}

function StatCard({ icon, label, count }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between min-h-[160px]">
      <div className="text-xl font-bold text-gray-800 text-left">{label}</div>
      <div className="flex items-center justify-center flex-1 gap-4">
        <div className="text-purple-600">{icon}</div>
        <div className="text-4xl font-bold text-gray-800">{count}</div>
      </div>
    </div>
  );
}

function Dropdown({ options, label, value, onChange }) {
  return (
    <div className="relative w-fit">
      <select
        className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>{`${label}: ${opt}`}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}
