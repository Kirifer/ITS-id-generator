import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
	LayoutGrid, Contact, NotebookText, LogOut,
	User, CreditCard, Landmark, Briefcase,
	Tag, Phone, UploadCloud, Eye, Pencil, Trash2, ChevronDown
} from 'lucide-react';
import { FaChevronDown } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function GeneratedIds() {
  const mainRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const formRef = useRef(null);
  const listRef = useRef(null);
  const [syncedHeight, setSyncedHeight] = useState(0);

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

  const showMessageBox = (message, onClose) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
      background-color: white;
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      text-align: center;
      font-family: 'Poppins', sans-serif;
      z-index: 9999;
    `;

    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.cssText = `
      font-size: 1rem;
      margin-bottom: 10px;
      color: #000;
      font-weight: 300;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      padding: 8px 16px;
      background-color: #8A2BE2;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    `;

    closeButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (typeof onClose === 'function') onClose();
    });

    box.appendChild(messageText);
    box.appendChild(closeButton);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  };

  useLayoutEffect(() => {
    if (selectedId && formRef.current && syncedHeight === 0) {
      const formHeight = formRef.current.offsetHeight;
      setSyncedHeight(formHeight);
    }
  }, [selectedId, syncedHeight]);

  return (
    <div className="flex h-screen w-screen font-inter">

      {/* Sidebar - Start */}
      <aside className="w-60 min-w-[15rem] max-w-[15rem] bg-[#262046] text-white h-screen p-5 flex flex-col">
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
      <main ref={mainRef} className="flex-1 overflow-auto">
        <div className="flex justify-center items-center min-h-screen p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl items-stretch">

            {/* Generated ID List */}
            <div 
              ref={listRef}
              className="lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col h-full"
              style={{
                minHeight: `${syncedHeight || 664}px`
              }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
                <div className="flex gap-4 flex-wrap">
                  <Dropdown label="Type" options={["All", "Intern", "Employee"]} />
                  <Dropdown label="Status" options={["All", "Approved", "Pending"]} />
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden flex flex-col h-full">
                <div className="overflow-y-auto custom-scrollbar" style={{ height: '558px' }}>
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
                          <td className="p-4">{id.firstName} {id.lastName}</td>
                          <td className="p-4">{id.type}</td>
                          <td className="p-4">{id.status}</td>
                          <td className="p-4">{id.date}</td>
                          <td className="p-4 text-purple-600 flex justify-center gap-3">
                            <Eye size={16} className="cursor-pointer" />
                            <Pencil size={16} className="cursor-pointer" onClick={() => {
                              setSelectedId(id);
                              setPhoto(null);

                              if (mainRef.current) {
                                mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }} />
                            <Trash2 size={16} className="cursor-pointer" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div 
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6"
              style={{
                minHeight: `${syncedHeight}px`,
                transition: 'min-height 0.3s ease'
              }}
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Edit Details:</h2>
                <p className="text-gray-600 text-sm">Please provide the required information below.</p>
              </div>
              {selectedId ? (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    if (!form.checkValidity()) {
                      form.reportValidity();
                      return;
                    }

                    showMessageBox('ID Details Updated!', () => {
                      setSelectedId(null);
                      setPhoto(null);
                    });
                  }}
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithIcon Icon={User} value={selectedId.firstName || ''} placeholder="First Name" required />
                      <InputWithIcon Icon={User} value={selectedId.lastName || ''} placeholder="Last Name" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithIcon Icon={CreditCard} value="123456" label="ID Number" required />
                    <InputWithIcon Icon={Landmark} value="789101" label="Government Number" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWithIcon Icon={Briefcase} value={selectedId.position} label="Position" options={["Full Stack Developer", "Human Resources", "Marketing", "Creative", "SEO"]} required />
                    <SelectWithIcon Icon={Tag} value={selectedId.type} label="Type" options={["Intern", "Employee"]} required />
                  </div>

                  <InputWithIcon Icon={Phone} value="09123456789" label="Phone Number" required />

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
                    <div
                      className="flex flex-col items-center justify-center p-6 mb-7 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer transition-colors duration-200
                                  hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400"
                      onClick={() => document.getElementById('photoEditUpload').click()}
                      style={{ minHeight: '120px' }}
                    >
                      <UploadCloud size={32} />
                      <p className={`mt-2 text-sm text-center ${photo ? 'text-purple-600' : ''}`}>
                        {photo ? `Selected: ${photo.name}` : 'Click or drag a file to this area to upload.'}
                      </p>
                      <p className="text-xs text-center">Supported formats: JPEG & PNG. Max file size: 2MB.</p>
                      <input
                        type="file"
                        id="photoEditUpload"
                        className="hidden"
                        accept=".jpeg,.jpg,.png"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(null);
                        setPhoto(null);
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-800 text-sm font-extrabold">Select an ID to edit.</p>
              )}
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
        `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200 ${isActive ? 'bg-[#3E3862] text-white' : 'hover:text-purple-400'}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Dropdown({ label, options }) {
  return (
    <div className="relative w-fit">
      <select className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
        {options.map((option, i) => (
          <option key={i}>{label}: {option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}

function InputWithIcon({ Icon, label, value, placeholder, required = false }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          defaultValue={value}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

function SelectWithIcon({ Icon, label, value, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <select
          className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white"
          defaultValue={value}
        >
          {options.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>
  );
}