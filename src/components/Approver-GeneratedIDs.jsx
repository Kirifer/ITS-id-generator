import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Contact, NotebookText, LogOut,
  User, CreditCard, Briefcase, Tag,
  Phone, UploadCloud, Eye, Pencil, Trash2, ChevronDown
} from 'lucide-react';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

export default function Approver_GeneratedIDs() {
  const mainRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const formRef = useRef(null);
  const listRef = useRef(null);
  const [syncedHeight, setSyncedHeight] = useState(0);

  const [idData, setIdData] = useState([
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
  ]);

  const [selectedId, setSelectedId] = useState(null);

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
    if (formRef.current) {
      const formHeight = formRef.current.offsetHeight;
      setSyncedHeight(formHeight);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredData = idData.filter((id) => {
    const matchesSearch =
      `${id.firstName} ${id.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'All' || id.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || id.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex h-screen w-screen font-inter">
      {/* Sidebar */}
      <aside className="w-60 min-w-[15rem] max-w-[15rem] bg-[#262046] text-white h-screen p-5 flex flex-col">
        <div className="flex flex-col gap-12 flex-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-extrabold">IT Squarehub</h1>
          </div>
          <nav className="flex flex-col gap-4">
            <NavItem to="/approver-dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" />
            <NavItem to="/approver-generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" />
          </nav>
          <div className="flex-grow" />
          <NavItem to="/login" icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-auto">
        <div className="flex justify-center items-center min-h-screen p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl items-stretch">
            {/* List */}
            <div
              ref={listRef}
              className="lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col h-full"
              style={{ minHeight: `${syncedHeight || 741}px` }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

                <div className="flex gap-3 flex-wrap items-center">
                  {/* Filters */}
                  <Dropdown
                    label="Type"
                    options={["All", "Intern", "Employee"]}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  />
                  <Dropdown
                    label="Status"
                    options={["All", "Approved", "Pending"]}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />

                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden flex flex-col h-full">
                <div className="overflow-y-auto custom-scrollbar" style={{ height: '630px' }}>
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
                      {filteredData.map((id, index) => (
                        <tr key={index} className="bg-white even:bg-gray-100">
                          <td className="p-4">{id.firstName} {id.lastName}</td>
                          <td className="p-4">{id.type}</td>
                          <td className="p-4">{id.status}</td>
                          <td className="p-4">{id.date}</td>
                          <td className="p-4 text-purple-600 flex justify-center gap-3">
                            <Eye size={16} className="cursor-pointer" />
                            <Pencil size={16} className="cursor-pointer" onClick={() => {
                              setSelectedId({ ...id });
                              setPhoto(id.photo);
                              mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            }} />
                            <Trash2 size={16} className="cursor-pointer" />
                          </td>
                        </tr>
                      ))}
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

            {/* Edit Form */}
            <div
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6"
              style={{ minHeight: `${syncedHeight}px` }}
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
                    setIdData(prev =>
                      prev.map(item =>
                        item.idNumber === selectedId.idNumber ? selectedId : item
                      )
                    );
                    showMessageBox('ID Details Updated!', () => {
                      setSelectedId(null);
                      setPhoto(null);
                    });
                  }}
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputWithIcon Icon={User} value={selectedId.firstName} onChange={(e) => setSelectedId({ ...selectedId, firstName: e.target.value })} placeholder="First Name" required />
                      <InputWithIcon Icon={User} value={selectedId.middleInitial} onChange={(e) => setSelectedId({ ...selectedId, middleInitial: e.target.value })} placeholder="Middle Initial" required />
                      <InputWithIcon Icon={User} value={selectedId.lastName} onChange={(e) => setSelectedId({ ...selectedId, lastName: e.target.value })} placeholder="Last Name" required />
                    </div>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">ID Number</label>
                    <InputWithIcon Icon={CreditCard} value={selectedId.idNumber} onChange={(e) => setSelectedId({ ...selectedId, idNumber: e.target.value })} placeholder="Enter ID Number" required />
                  </div>

                  {/* Position and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWithIcon Icon={Briefcase} value={selectedId.position} onChange={(e) => setSelectedId({ ...selectedId, position: e.target.value })} label="Position" options={["Full Stack Developer", "Human Resources", "Marketing", "Creative", "SEO"]} required />
                    <SelectWithIcon Icon={Tag} value={selectedId.type} onChange={(e) => setSelectedId({ ...selectedId, type: e.target.value })} label="Type" options={["Intern", "Employee"]} required />
                  </div>

                  {/* Emergency Contact Person */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Person</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputWithIcon Icon={User} value={selectedId.emergencyFirstName} onChange={(e) => setSelectedId({ ...selectedId, emergencyFirstName: e.target.value })} placeholder="First Name" required />
                      <InputWithIcon Icon={User} value={selectedId.emergencyMiddleInitial} onChange={(e) => setSelectedId({ ...selectedId, emergencyMiddleInitial: e.target.value })} placeholder="Middle Initial" required />
                      <InputWithIcon Icon={User} value={selectedId.emergencyLastName} onChange={(e) => setSelectedId({ ...selectedId, emergencyLastName: e.target.value })} placeholder="Last Name" required />
                    </div>
                  </div>

                  {/* Emergency Contact Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Number</label>
                    <InputWithIcon Icon={Phone} value={selectedId.emergencyContactNumber} onChange={(e) => setSelectedId({ ...selectedId, emergencyContactNumber: e.target.value })} placeholder="Enter Phone Number" required />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
                    <div
                      className="flex flex-col items-center justify-center p-6 mb-7 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 cursor-pointer transition-colors duration-200
                                  hover:border-purple-300 hover:text-purple-400"
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
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setPhoto(file);
                          setSelectedId({ ...selectedId, photo: file });
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex gap-4">
                    <button type="submit" className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg">
                      Update
                    </button>
                    <button type="button" onClick={() => { setSelectedId(null); setPhoto(null); }} className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-3 rounded-md transition duration-200 text-lg">
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

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="relative w-fit">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}

function InputWithIcon({ Icon, label, value, placeholder, required = false, onChange }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function SelectWithIcon({ Icon, label, value, options, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <select
          className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white"
          value={value}
          onChange={onChange}
          required={required}
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