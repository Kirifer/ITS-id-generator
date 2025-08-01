import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	LayoutGrid, Contact, NotebookText, LogOut
} from 'lucide-react';
import {
  FaIdCard, FaUserCheck, FaClipboardList, FaTasks, FaChevronDown
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function Dashboard() {
  const idData = [
    { firstName: 'Emily', lastName: 'Tan', type: 'Intern', status: 'Pending', date: '05/02/2025' },
    { firstName: 'David', lastName: 'Cruz', type: 'Employee', status: 'Approved', date: '11/15/2023' },
    { firstName: 'Juan', lastName: 'Reyes', type: 'Employee', status: 'Approved', date: '03/24/2024' },
    { firstName: 'Laura', lastName: 'Santos', type: 'Intern', status: 'Pending', date: '01/17/2025' },
    { firstName: 'Michael', lastName: 'Lim', type: 'Employee', status: 'Approved', date: '06/21/2020' },
    { firstName: 'Jane', lastName: 'Torres', type: 'Employee', status: 'Approved', date: '08/11/2022' },
    { firstName: 'Tom', lastName: 'Garcia', type: 'Intern', status: 'Pending', date: '02/05/2025' },
    { firstName: 'Sarah', lastName: 'Lopez', type: 'Employee', status: 'Approved', date: '09/19/2021' },
    { firstName: 'Rachel', lastName: 'Fernandez', type: 'Intern', status: 'Pending', date: '07/30/2025' },
    { firstName: 'John', lastName: 'Williams', type: 'Employee', status: 'Approved', date: '04/03/2023' },
    { firstName: 'Mark', lastName: 'Villanueva', type: 'Intern', status: 'Pending', date: '06/28/2025' },
    { firstName: 'Alyssa', lastName: 'Rivera', type: 'Employee', status: 'Approved', date: '12/10/2023' },
    { firstName: 'Kevin', lastName: 'Gomez', type: 'Intern', status: 'Pending', date: '03/12/2025' },
    { firstName: 'Nicole', lastName: 'Ramos', type: 'Employee', status: 'Approved', date: '10/08/2022' },
    { firstName: 'Brian', lastName: 'Delos Reyes', type: 'Intern', status: 'Pending', date: '07/15/2025' }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar - Start */}
      <aside className="w-60 min-w-[15rem] max-w-[15rem] bg-[#262046] text-white h-screen p-5 flex flex-col overflow-hidden">
        <div className="flex flex-col gap-12 flex-1">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-extrabold">IT Squarehub</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-4">
            <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" />
            <NavItem to="/id-generator" icon={<Contact size={20} />} label="ID Generator" />
            <NavItem to="/generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" />
          </nav>

          <div className="flex-grow" />

          {/* Logout */}
          <div>
            <NavItem to="/login" icon={<LogOut size={20} />} label="Logout" />
          </div>

        </div>
      </aside>
      {/* Sidebar - End */}

      {/* Main Content - Start */}
      <main className="flex-1 p-6 custom-bg flex flex-col overflow-hidden">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />} label="Total Generated IDs" count={132} />
          <StatCard icon={<FaUserCheck size={50} />} label="Approved" count={23} />
          <StatCard icon={<FaClipboardList size={50} />} label="Pending" count={35} />
          <StatCard icon={<FaTasks size={50} />} label="Actions" count={58} />
        </div>

        {/* Generated IDs Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden">

          {/* Header and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

            <div className="flex gap-4 flex-wrap">
              <div className="relative w-fit">
                <select className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {['All', 'Intern', 'Employee'].map((type, i) => (
                    <option key={i}>{`Type: ${type}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transform text-purple-600">
                  <FaChevronDown size={14} />
                </div>
              </div>

              <div className="relative w-fit">
                <select className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {['All', 'Approved', 'Pending'].map((status, i) => (
                    <option key={i}>{`Status: ${status}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 transform text-purple-600">
                  <FaChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
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
                  {idData.map((id, index) => {
                    const isLast = index === idData.length - 1;
                    return (
                      <tr key={index} className="bg-white even:bg-gray-100">
                        <td className="p-4">{`${id.firstName} ${id.lastName}`}</td>
                        <td className="p-4">{id.type}</td>
                        <td className="p-4">{id.status}</td>
                        <td className="p-4">{id.date}</td>
                        <td
                          className={`p-4 text-purple-600 cursor-pointer hover:underline ${
                            isLast ? 'rounded-br-2xl' : ''
                          }`}
                        >
                          {id.status === 'Pending' ? 'Approve' : 'View'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
      {/* Main Content - End */}
    
    </div>
  );
}

function NavItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200
         ${isActive ? 'bg-[#3E3862] text-white' : 'hover:text-purple-400'}`
      }
    >
      {icon}
      <span>{label}</span>
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