import React from 'react';
import {
  FaTh,
  FaIdCard,
  FaSignOutAlt,
  FaUserCheck,
  FaClipboardList,
  FaTasks
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function Dashboard() {
  const idData = [
    { name: 'Cruz', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Doe', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { name: 'Williams', type: 'Employee', status: 'Approved', date: '03/24/2024' },
    { name: 'Miller', type: 'Employee', status: 'Approved', date: '06/21/2020' },
  ];

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
            <NavItem icon={<FaTh />} label="Dashboard" />
            <NavItem icon={<FaIdCard />} label="ID Generator" />
            <NavItem icon={<FaIdCard />} label="Generated IDs" />
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <NavItem icon={<FaSignOutAlt />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
        <main className="flex-1 p-6 custom-bg">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />} label="Total Generated IDs" count={132} />
          <StatCard icon={<FaUserCheck size={50} />} label="Approved" count={23} />
          <StatCard icon={<FaClipboardList size={50} />} label="Pending" count={35} />
          <StatCard icon={<FaTasks size={50} />} label="Actions" count={58} />
        </div>

        {/* Generated IDs Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Header and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border rounded-xl overflow-hidden">
                <thead className="bg-[#D0CAF3] text-black font-bold">
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
                        <td className="p-4 text-purple-600 cursor-pointer hover:underline text-center">
                        {id.status === 'Pending' ? 'Approve' : 'View'}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 hover:text-purple-400 cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ icon, label, count }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between min-h-[160px]">
      <div className="text-xl font-bold text-gray-700 text-left">{label}</div>
      <div className="flex items-center justify-center flex-1 gap-4">
        <div className="text-purple-600">{icon}</div>
        <div className="text-4xl font-bold text-gray-800">{count}</div>
      </div>
    </div>
  );
}
