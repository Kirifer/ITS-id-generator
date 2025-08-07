import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  FaTh,
  FaIdCard,
  FaSignOutAlt
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import frontID from '../assets/images/1 FRONT.png';
import backID from '../assets/images/1 BACK.png';

export default function DashboardHR() {
  const idData = [
    { name: 'Cruz', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Doe', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Williams', type: 'Employee', status: 'Approved', date: '03/24/2024' },
    { name: 'Miller', type: 'Employee', status: 'Approved', date: '06/21/2020' },
  ];

  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold">IT Squarehub</h1>
          </div>

          <nav className="space-y-3">
            <NavItem to="/dashboardhr" icon={<FaTh />} label="Dashboard" />
            <NavItem to="/approvalhr" icon={<FaIdCard />} label="Generated IDs" />
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/login" icon={<FaSignOutAlt />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          selectedId ? 'mr-[440px]' : ''
        } custom-bg flex items-center justify-center min-h-screen`}
      >
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-6xl h-[75vh] flex flex-col">
          {/* Header and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
            <div className="flex gap-4 flex-wrap">
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300">
                <option>All Interns</option>
                <option>Intern</option>
                <option>Employee</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300">
                <option>Status: All</option>
                <option>Approved</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-center border rounded-xl overflow-hidden">
              <thead className="bg-[#D0CAF3] text-black font-bold sticky top-0">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Generated</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {idData.map((id, index) => (
                  <tr key={index} className="bg-white even:bg-gray-100">
                    <td className="p-4 text-center">{id.name}</td>
                    <td className="p-4 text-center">{id.type}</td>
                    <td className="p-4 text-center">{id.status}</td>
                    <td className="p-4 text-center">{id.date}</td>
                    <td className="p-4 text-purple-600 cursor-pointer flex items-center justify-center"
                      onClick={() => setSelectedId(id)}>
                        <Eye size={16}   className="hover:border-b hover:border-purple-800 transition-all duration-200 cursor-pointer" />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ID Preview Panel */}
        {selectedId && (
          <div className="fixed top-1/2 right-6 -translate-y-1/2 w-[400px] h-[75vh] max-h-[90vh] bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 z-50 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">ID Preview</h2>
              <button
                className="text-2xl font-bold text-gray-500 hover:text-red-500"
                onClick={() => setSelectedId(null)}
              >
                &times;
              </button>
            </div>

            {/* ID Cards */}
            <div className="flex flex-col gap-6 flex-1">
              <div className="flex gap-4 flex-1">
                {/* Front */}
                <div className="flex-1 text-center flex flex-col">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Front</p>
                  <div className="flex-1 flex items-center justify-center">
                    {selectedId.name === 'Cruz' ? (
                      <img
                        src={frontID}
                        alt="Front ID"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Front ID</span>
                    )}
                  </div>
                </div>

                {/* Back */}
                <div className="flex-1 text-center flex flex-col">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Back</p>
                  <div className="flex-1 flex items-center justify-center">
                    {selectedId.name === 'Cruz' ? (
                      <img
                        src={backID}
                        alt="Back ID"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Back ID</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto">
              <button className="w-1/2 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                Approve
              </button>
              <button className="w-1/2 py-2 rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500">
                Reject
              </button>
            </div>
          </div>
        )}
      </main>
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
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
