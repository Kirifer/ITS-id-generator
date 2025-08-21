import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { FaTh, FaIdCard, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import frontID from '../assets/images/1 FRONT.png';
import backID from '../assets/images/1 BACK.png';

export default function DashboardHR() {
  const idData = [
    { firstName: 'Emily', middleInitial: 'A', lastName: 'Tan', type: 'Intern', status: 'Pending', date: '05/02/2025' },
    { firstName: 'David', middleInitial: 'M', lastName: 'Cruz', type: 'Employee', status: 'Approved', date: '11/15/2023' },
    { firstName: 'Sarah', middleInitial: 'J', lastName: 'Lopez', type: 'Intern', status: 'Pending', date: '07/21/2024' },
    { firstName: 'Michael', middleInitial: 'K', lastName: 'Reyes', type: 'Employee', status: 'Approved', date: '01/05/2023' },
    { firstName: 'Jessica', middleInitial: 'L', lastName: 'Gomez', type: 'Employee', status: 'Approved', date: '03/18/2022' },
    { firstName: 'Brian', middleInitial: 'D', lastName: 'Santos', type: 'Intern', status: 'Pending', date: '09/14/2024' },
    { firstName: 'Olivia', middleInitial: 'E', lastName: 'Lim', type: 'Employee', status: 'Approved', date: '04/09/2023' },
    { firstName: 'Daniel', middleInitial: 'P', lastName: 'Chua', type: 'Employee', status: 'Approved', date: '02/27/2024' },
    { firstName: 'Sophia', middleInitial: 'H', lastName: 'Rivera', type: 'Intern', status: 'Pending', date: '06/11/2024' },
    { firstName: 'Anthony', middleInitial: 'F', lastName: 'Diaz', type: 'Employee', status: 'Approved', date: '12/30/2022' }
  ];

  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = idData.filter((id) => {
    const fullName = `${id.firstName} ${id.middleInitial} ${id.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || id.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          selectedId ? 'w-20' : 'w-60'
        } bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            {!selectedId && <h1 className="text-xl font-bold">IT Squarehub</h1>}
          </div>

          <nav className="space-y-3">
            <NavItem to="/dashboardhr" icon={<FaTh />} label={!selectedId && 'Dashboard'} />
            <NavItem to="/approvalhr" icon={<FaIdCard />} label={!selectedId && 'Generated IDs'} />
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/login" icon={<FaSignOutAlt />} label={!selectedId && 'Logout'} />
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          selectedId ? 'mr-[600px]' : ''
        } custom-bg flex items-center justify-center min-h-screen`}
      >
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-6xl max-h-[75vh] overflow-hidden flex flex-col">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
            <div className="flex gap-4 flex-wrap items-center">
              <select
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Intern">Intern</option>
                <option value="Employee">Employee</option>
              </select>

              <select
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">Status: All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="border border-gray-300 rounded-lg pl-8 pr-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 w-4 h-4 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
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
                {filteredData.length ? (
                  filteredData.map((id, index) => (
                    <tr key={index} className="bg-white even:bg-gray-100">
                      <td className="p-4">{`${id.firstName} ${id.middleInitial} ${id.lastName}`}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-gray-500 italic">
                      No matching results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ID Preview Panel */}
          {selectedId && (
            <div className="fixed top-1/2 right-6 -translate-y-1/2 w-[580px] max-h-[90vh] rounded-2xl shadow-2xl p-4 z-50 flex flex-col items-center bg-transparent overflow-y-auto">
              <div className="p-3 rounded-xl flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Front</p>
                  <img
                    src={frontID}
                    alt="Front ID"
                    className={`object-contain ${
                      selectedId.status === 'Pending' ? 'w-[160px]' : 'w-[140px]'
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Back</p>
                  <img
                    src={backID}
                    alt="Back ID"
                    className={`object-contain ${
                      selectedId.status === 'Pending' ? 'w-[160px]' : 'w-[140px]'
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

              {selectedId.status === 'Pending' && (
                <div className="flex gap-3 mt-3 w-full">
                  <button className="w-1/2 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
                    Approve
                  </button>
                  <button className="w-1/2 py-2 rounded-lg bg-red-400 text-white font-semibold hover:bg-red-500">
                    Reject
                  </button>
                </div>
              )}
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
        } justify-start`
      }
    >
      {icon}
      {label && <span>{label}</span>}
    </NavLink>
  );
}
