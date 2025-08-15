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
  FaChevronDown
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import frontID from '../assets/images/1 FRONT.png';
import backID from '../assets/images/1 BACK.png';

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(null);

  const idData = [
    { name: 'Cruz', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Doe', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Williams', type: 'Employee', status: 'Approved', date: '03/24/2024' },
    { name: 'Miller', type: 'Employee', status: 'Approved', date: '06/21/2020' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`${
          selectedId ? 'w-20' : 'w-60'
        } bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            {!selectedId && <h1 className="text-xl font-bold">IT Squarehub</h1>}
          </div>

          {/* Navigation */}
          <nav className="space-y-3">
            <NavItem to="/dashboardhr" icon={<FaTh />} label={!selectedId && 'Dashboard'} />
            <NavItem to="/approvalhr" icon={<FaIdCard />} label={!selectedId && 'Generated IDs'} />
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/login" icon={<FaSignOutAlt />} label={!selectedId && 'Logout'} />
        </div>
      </aside>

      {/* Main */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          selectedId ? 'mr-[600px]' : ''
        } custom-bg flex flex-col overflow-hidden`}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />} label="Total Generated IDs" count={132} />
          <StatCard icon={<FaUserCheck size={50} />} label="Approved" count={23} />
          <StatCard icon={<FaClipboardList size={50} />} label="Pending" count={35} />
          <StatCard icon={<FaTasks size={50} />} label="Actions" count={58} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden">
          {/* Header + Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

            <div className="flex gap-4 flex-wrap">
              <Dropdown options={['All', 'Intern', 'Employee']} label="Type" />
              <Dropdown options={['All', 'Approved', 'Pending']} label="Status" />
            </div>
          </div>

          {/* Data table */}
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
                  {idData.map((id, index) => (
                    <tr key={index} className="bg-white even:bg-gray-100">
                      <td className="p-4">{id.name}</td>
                      <td className="p-4">{id.type}</td>
                      <td className="p-4">{id.status}</td>
                      <td className="p-4">{id.date}</td>
                      <td
                        className="p-4 text-purple-600 cursor-pointer flex items-center justify-center"
                        onClick={() => setSelectedId(id)}
                      >
                        <Eye
                          size={16}
                          className="hover:border-b hover:border-purple-800 transition-all duration-200"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      {selectedId && (
        <div className="fixed top-1/2 right-6 -translate-y-1/2 w-[580px] max-h-[90vh] rounded-2xl shadow-2xl p-4 z-50 flex flex-col items-center bg-transparent">
          <div className="p-3 rounded-xl flex justify-center gap-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-700 mb-1">Front</p>
              <img
                src={frontID}
                alt="Front ID"
                className={`object-contain ${
                  selectedId.status === 'Pending' ? 'w-[200px]' : 'w-[180px]'
                }`}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-700 mb-1">Back</p>
              <img
                src={backID}
                alt="Back ID"
                className={`object-contain ${
                  selectedId.status === 'Pending' ? 'w-[200px]' : 'w-[180px]'
                }`}
              />
            </div>
          </div>

          <div className="w-full mt-4">
            {selectedId.status === 'Approved' ? (
              <div className="flex flex-col gap-3">
                <div className="bg-white p-3 rounded-lg shadow text-sm">
                  <p className="font-semibold">Generated by:</p>
                  <p>Janssen Gundran</p>
                  <p className="text-gray-500">janssen@gmail.com</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow text-sm">
                  <p className="font-semibold">Approved by:</p>
                  <p>Christian Elagio</p>
                  <p className="text-gray-500">christian@gmail.com</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-lg shadow text-sm">
                <p className="font-semibold">Generated by:</p>
                <p>Janssen Gundran</p>
                <p className="text-gray-500">janssen@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, to }) {
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
      {label && <span>{label}</span>}
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

function Dropdown({ options, label }) {
  return (
    <div className="relative w-fit">
      <select className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
        {options.map((opt, i) => (
          <option key={i}>{`${label}: ${opt}`}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transform text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}
