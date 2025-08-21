import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Contact, NotebookText, LogOut
} from 'lucide-react';
import {
  FaIdCard, FaUserCheck, FaClipboardList, FaTasks, FaChevronDown, FaSearch
} from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function HR_Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const idData = [
    {firstName:'Emily',middleInitial:'A',lastName:'Tan',idNumber:'1001',position:'Full Stack Developer',type:'Intern',status:'Pending',date:'05/02/2025',emergencyFirstName:'Anna',emergencyMiddleInitial:'B',emergencyLastName:'Tan',emergencyContactNumber:'09171234567',photo:null},
    {firstName:'David',middleInitial:'M',lastName:'Cruz',idNumber:'1002',position:'Marketing',type:'Employee',status:'Approved',date:'11/15/2023',emergencyFirstName:'Maria',emergencyMiddleInitial:'S',emergencyLastName:'Cruz',emergencyContactNumber:'09182345678',photo:null},
    {firstName:'Sarah',middleInitial:'J',lastName:'Lopez',idNumber:'1003',position:'Designer',type:'Intern',status:'Pending',date:'07/21/2024',emergencyFirstName:'John',emergencyMiddleInitial:'P',emergencyLastName:'Lopez',emergencyContactNumber:'09193456789',photo:null},
    {firstName:'Michael',middleInitial:'K',lastName:'Reyes',idNumber:'1004',position:'HR Manager',type:'Employee',status:'Approved',date:'01/05/2023',emergencyFirstName:'Karen',emergencyMiddleInitial:'L',emergencyLastName:'Reyes',emergencyContactNumber:'09204567891',photo:null},
    {firstName:'Jessica',middleInitial:'L',lastName:'Gomez',idNumber:'1005',position:'Project Manager',type:'Employee',status:'Approved',date:'03/18/2022',emergencyFirstName:'Paul',emergencyMiddleInitial:'T',emergencyLastName:'Gomez',emergencyContactNumber:'09215678912',photo:null},
    {firstName:'Brian',middleInitial:'D',lastName:'Santos',idNumber:'1006',position:'QA Tester',type:'Intern',status:'Pending',date:'09/14/2024',emergencyFirstName:'Ella',emergencyMiddleInitial:'R',emergencyLastName:'Santos',emergencyContactNumber:'09226789123',photo:null},
    {firstName:'Olivia',middleInitial:'E',lastName:'Lim',idNumber:'1007',position:'Data Analyst',type:'Employee',status:'Approved',date:'04/09/2023',emergencyFirstName:'Chris',emergencyMiddleInitial:'Q',emergencyLastName:'Lim',emergencyContactNumber:'09237891234',photo:null},
    {firstName:'Daniel',middleInitial:'P',lastName:'Chua',idNumber:'1008',position:'Software Engineer',type:'Employee',status:'Approved',date:'02/27/2024',emergencyFirstName:'Liza',emergencyMiddleInitial:'V',emergencyLastName:'Chua',emergencyContactNumber:'09248912345',photo:null},
    {firstName:'Sophia',middleInitial:'H',lastName:'Rivera',idNumber:'1009',position:'UI/UX Designer',type:'Intern',status:'Pending',date:'06/11/2024',emergencyFirstName:'Mark',emergencyMiddleInitial:'C',emergencyLastName:'Rivera',emergencyContactNumber:'09259123456',photo:null},
    {firstName:'Anthony',middleInitial:'F',lastName:'Diaz',idNumber:'1010',position:'Accountant',type:'Employee',status:'Approved',date:'12/30/2022',emergencyFirstName:'Grace',emergencyMiddleInitial:'H',emergencyLastName:'Diaz',emergencyContactNumber:'09261234567',photo:null},
    {firstName:'Isabella',middleInitial:'T',lastName:'Fernandez',idNumber:'1011',position:'Content Writer',type:'Intern',status:'Pending',date:'08/25/2024',emergencyFirstName:'Tom',emergencyMiddleInitial:'B',emergencyLastName:'Fernandez',emergencyContactNumber:'09272345678',photo:null},
    {firstName:'Jacob',middleInitial:'Q',lastName:'Martinez',idNumber:'1012',position:'Support Specialist',type:'Employee',status:'Approved',date:'10/19/2023',emergencyFirstName:'Rosa',emergencyMiddleInitial:'I',emergencyLastName:'Martinez',emergencyContactNumber:'09283456789',photo:null},
    {firstName:'Chloe',middleInitial:'S',lastName:'Ng',idNumber:'1013',position:'Business Analyst',type:'Employee',status:'Approved',date:'07/04/2022',emergencyFirstName:'Leo',emergencyMiddleInitial:'D',emergencyLastName:'Ng',emergencyContactNumber:'09294567891',photo:null},
    {firstName:'Ethan',middleInitial:'G',lastName:'Torres',idNumber:'1014',position:'Operations Manager',type:'Employee',status:'Approved',date:'05/28/2023',emergencyFirstName:'Faye',emergencyMiddleInitial:'M',emergencyLastName:'Torres',emergencyContactNumber:'09305678912',photo:null},
    {firstName:'Mia',middleInitial:'V',lastName:'Ramos',idNumber:'1015',position:'Sales Executive',type:'Intern',status:'Pending',date:'09/09/2024',emergencyFirstName:'Ian',emergencyMiddleInitial:'K',emergencyLastName:'Ramos',emergencyContactNumber:'09316789123',photo:null}
  ];

  const filteredData = idData.filter(id => {
    const matchesSearch = `${id.firstName} ${id.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || id.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar */}
      <aside className="w-60 min-w-[15rem] max-w-[15rem] bg-[#262046] text-white h-screen p-5 flex flex-col overflow-hidden">
        <div className="flex flex-col gap-12 flex-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-extrabold">IT Squarehub</h1>
          </div>
          <nav className="flex flex-col gap-4">
            <NavItem to="/hr-dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" />
            <NavItem to="/hr-generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" />
          </nav>
          <div className="flex-grow" />
          <div>
            <NavItem to="/login" icon={<LogOut size={20} />} label="Logout" />
          </div>
        </div>
      </aside>

      {/* Main */}
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
          
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
            <div className="flex gap-4 flex-wrap items-center">
              
              {/* Type Filter */}
              <div className="relative w-fit">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {['All', 'Intern', 'Employee'].map((type, i) => (
                    <option key={i} value={type}>{`Type: ${type}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600">
                  <FaChevronDown size={14} />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative w-fit">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {['All', 'Approved', 'Pending'].map((status, i) => (
                    <option key={i} value={status}>{`Status: ${status}`}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600">
                  <FaChevronDown size={14} />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-8 pr-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
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
                  {filteredData.length > 0 ? (
                    filteredData.map((id, index) => {
                      const isLast = index === filteredData.length - 1;
                      return (
                        <tr key={index} className="bg-white even:bg-gray-100">
                          <td className="p-4">{`${id.firstName} ${id.lastName}`}</td>
                          <td className="p-4">{id.type}</td>
                          <td className="p-4">{id.status}</td>
                          <td className="p-4">{id.date}</td>
                          <td className={`p-4 text-purple-600 cursor-pointer hover:underline ${isLast ? 'rounded-br-2xl' : ''}`}>
                            {id.status === 'Pending' ? 'Approve' : 'View'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-gray-500 italic">No matching results.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
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