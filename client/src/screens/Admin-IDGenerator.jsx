import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import api, { clearToken } from "../api/axios";
import {
  LayoutGrid, Contact, NotebookText, LogOut,
  User, CreditCard, Briefcase, Tag,
  Phone, UploadCloud, ChevronDown
} from 'lucide-react';
import { FaChevronDown, FaSearch,  FaSignOutAlt } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ASSET_BASE = (API_BASE || '').replace(/\/api$/, '');

export default function Admin_IDGenerator() {
  const navigate = useNavigate();
  const [sidebarHover, setSidebarHover] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Guard: require login
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  // Employee Name
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');

  // ID & Role
  const [idNumber, setIdNumber] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');

  // Emergency Contact
  const [emFirstName, setEmFirstName] = useState('');
  const [emMiddleInitial, setEmMiddleInitial] = useState('');
  const [emLastName, setEmLastName] = useState('');
  const [emPhone, setEmPhone] = useState('');

  // Photo
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');

  // Preview of the result returned by server
  const [previewUrl, setPreviewUrl] = useState('');

  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useLayoutEffect(() => {
    if (formRef.current) setFormHeight(formRef.current.offsetHeight);
  }, [
    firstName, middleInitial, lastName,
    idNumber, position, type,
    emFirstName, emMiddleInitial, emLastName, emPhone,
    photo, previewUrl
  ]);

  const showMessageBox = (message, onClose) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: rgba(0,0,0,.5); z-index: 9998; display:flex; align-items:center; justify-content:center;
    `;
    const box = document.createElement('div');
    box.style.cssText = `
      background: #fff; padding: 20px 30px; border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,.15); text-align: center; font-family: 'Poppins', sans-serif; z-index: 9999; font-weight: 500;
    `;
    const p = document.createElement('p');
    p.textContent = message;
    p.style.cssText = `font-size: 1rem; margin-bottom: 10px; color: #000; font-weight: 300;`;
    const btn = document.createElement('button');
    btn.textContent = 'Close';
    btn.style.cssText = `
      padding: 8px 16px; background-color: #8A2BE2; color: white; border: none;
      border-radius: 5px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 500;
    `;
    btn.addEventListener('click', () => {
      overlay.remove();
      if (typeof onClose === 'function') onClose();
    });
    box.appendChild(p); box.appendChild(btn); overlay.appendChild(box); document.body.appendChild(overlay);
  };
  
function onLogout() {
        clearToken();
        localStorage.removeItem('role');
        navigate('/login');
      }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Photo
    if (photo) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(photo.type)) {
        showMessageBox('Invalid file type. Only JPEG and PNG are allowed.');
        return;
      }
      if (photo.size > 2 * 1024 * 1024) {
        showMessageBox('File too large. Maximum allowed file size is 2MB.');
        return;
      }
    }

    // Build multipart/form-data
    const fd = new FormData();
    fd.append('firstName', firstName);
    fd.append('middleInitial', middleInitial);
    fd.append('lastName', lastName);
    fd.append('idNumber', idNumber);
    fd.append('position', position);
    fd.append('type', type);
    fd.append('emFirstName', emFirstName);
    fd.append('emMiddleInitial', emMiddleInitial);
    fd.append('emLastName', emLastName);
    fd.append('emPhone', emPhone);
    if (photo) fd.append('photo', photo);

    const { data: created } = await api.post('/id-cards', fd);
    try {
      // USE axios instance that injects Authorization header
      showMessageBox('ID generated and saved (Pending)!');

      // show preview on the right: prefer generated image, fallback to uploaded photo
      const p = created?.generatedImagePath || created?.photoPath || '';
      setPreviewUrl(p ? ASSET_BASE + p : '');

      // Reset form
      setFirstName('');
      setMiddleInitial('');
      setLastName('');
      setIdNumber('');
      setPosition('');
      setType('');
      setEmFirstName('');
      setEmMiddleInitial('');
      setEmLastName('');
      setEmPhone('');
      setPhoto(null);
      setPhotoError('');
    } catch (err) {
      if (err?.response?.status === 401) {
        showMessageBox('Your session has expired or you are not logged in.', () => navigate('/login'));
        return;
      }
      const msg = err?.response?.data?.message || err?.message || 'Failed to create ID.';
      showMessageBox(msg);
    }
  };

  const previewMounted = Boolean(selectedId) && !sidebarHover;
  const sidebarExpanded = !selectedId || sidebarHover;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
    {/* Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className={`${selectedId && !sidebarHover ? 'w-20' : 'w-60'} bg-[#262046] text-white min-h-screen p-5 flex flex-col justify-between transition-all duration-300`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'} text-xl font-bold`}>
              IT Squarehub
            </span>
          </div>
          <nav className="space-y-3">
            <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" sidebarExpanded={sidebarExpanded}/>
            <NavItem to="/id-generator" icon={<Contact size={20} />} label="ID Generator" sidebarExpanded={sidebarExpanded}/>
            <NavItem to="/generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" sidebarExpanded={sidebarExpanded}/>
          </nav>
        </div>
        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/logout" icon={<FaSignOutAlt />} label="Logout" sidebarExpanded={sidebarExpanded}/>
        </div>
      </aside>


      {/* Main Content - Start */}
      <main className="flex-1 custom-bg overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 md:px-6 py-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-6">

            {/* Form */}
            <div className="w-full md:flex-1">
              <div
                ref={formRef}
                className="bg-white rounded-2xl shadow-lg pt-4 sm:pt-6 px-2 sm:px-8 pb-6 sm:pb-7 w-full"
              >
                <h2 className="text-2xl font-bold text-gray-800">Enter Details:</h2>
                <p className="text-gray-600 mb-4 text-sm">Please provide the required information below.</p>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="firstName"
                          placeholder="First Name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="middleInitial"
                          placeholder="Middle Initial"
                          maxLength={1}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={middleInitial}
                          onChange={(e) => setMiddleInitial(e.target.value.toUpperCase())}
                          required
                        />
                      </div>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="lastName"
                          placeholder="Last Name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>

                    </div>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-semibold text-gray-800 mb-1">ID Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        id="idNumber"
                        placeholder="Enter ID Number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Position and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="position" className="block text-sm font-semibold text-gray-800 mb-1">Position</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          id="position"
                          className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${position ? 'text-gray-900' : 'text-gray-400'}`}
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          required
                        >
                          <option value="" disabled hidden>Select Position</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Creative">Creative</option>
                          <option value="SEO">SEO</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-semibold text-gray-800 mb-1">Type</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          id="type"
                          className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${type ? 'text-gray-900' : 'text-gray-400'}`}
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                        >
                          <option value="" disabled hidden>Select Type</option>
                          <option value="Intern">Intern</option>
                          <option value="Employee">Employee</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Person */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Person</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="emFirstName"
                          placeholder="First Name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={emFirstName}
                          onChange={(e) => setEmFirstName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="emMiddleInitial"
                          placeholder="Middle Initial"
                          maxLength={1}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={emMiddleInitial}
                          onChange={(e) => setEmMiddleInitial(e.target.value.toUpperCase())}
                          required
                        />
                      </div>

                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          id="emLastName"
                          placeholder="Last Name"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                          value={emLastName}
                          onChange={(e) => setEmLastName(e.target.value)}
                          required
                        />
                      </div>

                    </div>
                  </div>

                  {/* Emergency Contact Number */}
                  <div>
                    <label htmlFor="emPhone" className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        id="emPhone"
                        placeholder="Enter Phone Number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                        value={emPhone}
                        onChange={(e) => setEmPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
                    <label
                      htmlFor="photoUpload"
                      className={`flex flex-col items-center justify-center p-6 mb-3 border-2 border-dashed rounded-lg text-gray-500 cursor-pointer transition-colors duration-200
                        hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400`}
                      style={{ minHeight: '120px' }}
                    >
                      <UploadCloud size={32} />
                      <p className={`mt-2 text-sm text-center ${photo ? 'text-purple-600' : ''}`}>
                        {photo ? `Selected: ${photo.name}` : 'Click or drag a file to this area to upload.'}
                      </p>
                      <p className="text-xs text-center">Supported formats: JPEG & PNG. Max file size: 2MB.</p>
                      {photoError && <p className="text-xs text-center text-red-500 mt-2">{photoError}</p>}
                    </label>
                    <input
                      type="file"
                      id="photoUpload"
                      className="hidden"
                      accept=".jpeg,.jpg,.png"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
                            setPhoto(null);
                            setPhotoError('Invalid file type. Only JPEG and PNG are allowed.');
                            return;
                          }
                          if (selectedFile.size > 2 * 1024 * 1024) {
                            setPhoto(null);
                            setPhotoError('File too large. Max 2MB.');
                            return;
                          }
                          setPhoto(selectedFile);
                          setPhotoError('');
                        }
                      }}
                      required
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
                  >
                    Generate
                  </button>

                </form>
              </div>
            </div>

            {/* Preview */}
            <div className="w-full md:flex-1">
              <div
                className="bg-white/50 rounded-2xl shadow-lg p-6 sm:p-8 w-full flex items-center justify-center"
                style={{
                  height: formHeight ? `${formHeight}px` : 'auto',
                  transition: 'height 0.3s ease'
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Generated ID"
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">Generated ID preview will appear here after submission.</div>
                )}
              </div>
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

