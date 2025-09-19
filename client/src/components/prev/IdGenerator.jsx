import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import {
  LayoutGrid, Contact, NotebookText, LogOut,
  User, CreditCard, Briefcase,
  Tag, Phone, UploadCloud, ChevronDown, MapPin, Barcode
} from 'lucide-react';

export default function IdGenerator() {
  // Front view fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [position, setPosition] = useState('');
  const [type, setType] = useState('');
  const [photo, setPhoto] = useState(null);

  // Rear view fields
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryPosition, setSignatoryPosition] = useState('');
  const [signatorySignature, setSignatorySignature] = useState(null);
  const [companyAddress, setCompanyAddress] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('idNumber', idNumber);
  formData.append('position', position);
  formData.append('type', type);
  formData.append('photo', photo);
  formData.append('emergencyContactName', emergencyContactName);
  formData.append('emergencyContactNumber', emergencyContactNumber);
  formData.append('signatoryName', signatoryName);
  formData.append('signatoryPosition', signatoryPosition);
  formData.append('signatorySignature', signatorySignature);
  formData.append('companyAddress', companyAddress);
  formData.append('barcodeValue', barcodeValue);

  const res = await fetch('http://localhost:5000/api/id/generate', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (data.success) {
    window.open(`http://localhost:5000/${data.file}`, '_blank');
  }
};


  const showMessageBox = (message, onClose) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
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
      font-weight: 500;
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
      font-weight: 500;
    `;
    closeButton.addEventListener('click', () => {
      overlay.remove();
      if (typeof onClose === 'function') onClose();
    });

    box.appendChild(messageText);
    box.appendChild(closeButton);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  };

  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useLayoutEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight);
    }
  }, [
    firstName, lastName, idNumber, position, type, photo,
    emergencyContactName, emergencyContactNumber,
    signatoryName, signatoryPosition, signatorySignature,
    companyAddress, barcodeValue
  ]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-inter">
      {/* Sidebar */}
      <aside className="w-60 min-w-[15rem] max-w-[15rem] bg-[#262046] text-white h-screen p-5 flex flex-col overflow-hidden">
        <div className="flex flex-col gap-12 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-extrabold">IT Squarehub</h1>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-4">
            <NavItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Dashboard" />
            <NavItem to="/id-generator" icon={<Contact size={20} />} label="ID Generator" />
            <NavItem to="/generated-ids" icon={<NotebookText size={20} />} label="Generated IDs" />
          </nav>
          <div className="flex-grow" />
          <div>
            <NavItem to="/login" icon={<LogOut size={20} />} label="Logout" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 custom-bg overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 md:px-6 py-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-6">
            {/* Form */}
            <div className="w-full md:flex-1">
              <div ref={formRef} className="bg-white rounded-2xl shadow-lg pt-4 sm:pt-6 px-2 sm:px-8 pb-6 sm:pb-7 w-full">
                <h2 className="text-2xl font-bold text-gray-800">Enter Details:</h2>
                <p className="text-gray-600 mb-4 text-sm">Fill in all the required fields for ID generation.</p>
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField icon={<User />} value={firstName} setValue={setFirstName} placeholder="First Name" required />
                    <InputField icon={<User />} value={lastName} setValue={setLastName} placeholder="Last Name" required />
                  </div>

                  {/* ID Number */}
                  <InputField icon={<CreditCard />} value={idNumber} setValue={setIdNumber} placeholder="ID Number" required />

                  {/* Position & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField icon={<Briefcase />} value={position} setValue={setPosition} placeholder="Select Position" options={["Full Stack Developer", "Human Resources", "Marketing", "Creative", "SEO"]} />
                    <SelectField icon={<Tag />} value={type} setValue={setType} placeholder="Select Type" options={["Intern", "Employee"]} />
                  </div>

                  {/* Emergency Contact */}
                  <InputField icon={<User />} value={emergencyContactName} setValue={setEmergencyContactName} placeholder="Emergency Contact Name" required />
                  <InputField icon={<Phone />} value={emergencyContactNumber} setValue={setEmergencyContactNumber} placeholder="Emergency Contact Number" required />

				  {/* Photo Upload */}
                  <FileUpload label="Photo Upload" file={photo} setFile={setPhoto} />

                  {/* Signatory Info */}
                  <InputField icon={<User />} value={signatoryName} setValue={setSignatoryName} placeholder="Signatory Name" required />
                  <InputField icon={<Briefcase />} value={signatoryPosition} setValue={setSignatoryPosition} placeholder="Signatory Position" required />
                  <FileUpload label="Signatory Signature" file={signatorySignature} setFile={setSignatorySignature} />

                  {/* Company Address */}
                  <InputField icon={<MapPin />} value={companyAddress} setValue={setCompanyAddress} placeholder="Company Address" required />

                  {/* Barcode Value */}
                  <InputField icon={<Barcode />} value={barcodeValue} setValue={setBarcodeValue} placeholder="Barcode Value" required />

                  {/* Submit */}
                  <button type="submit" className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg">
                    Generate
                  </button>
                </form>
              </div>
            </div>

            {/* Preview */}
            <div className="w-full md:flex-1">
              <div className="bg-white/50 rounded-2xl shadow-lg p-6 sm:p-8 w-full" style={{ height: formHeight ? `${formHeight}px` : 'auto', transition: 'height 0.3s ease' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Components
function NavItem({ icon, label, to }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center gap-3 px-2 py-1 rounded-md transition-colors duration-200 ${isActive ? 'bg-[#3E3862] text-white' : 'hover:text-purple-400'}`}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function InputField({ icon, value, setValue, placeholder, required }) {
  return (
    <div className="relative">
      {React.cloneElement(icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 })}
      <input type="text" placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm" value={value} onChange={(e) => setValue(e.target.value)} required={required} />
    </div>
  );
}

function SelectField({ icon, value, setValue, placeholder, options }) {
  return (
    <div className="relative">
      {React.cloneElement(icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 })}
      <select className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${value ? 'text-gray-900' : 'text-gray-400'}`} value={value} onChange={(e) => setValue(e.target.value)} required>
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
    </div>
  );
}

function FileUpload({ label, file, setFile }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <label htmlFor={label} className="flex flex-col items-center justify-center p-6 mb-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer transition-colors duration-200 hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400" style={{ minHeight: '120px' }}>
        <UploadCloud size={32} />
        <p className={`mt-2 text-sm text-center ${file ? 'text-purple-600' : ''}`}>
          {file ? `Selected: ${file.name}` : 'Click or drag a file to this area to upload.'}
        </p>
        <p className="text-xs text-center">Supported formats: JPEG & PNG. Max file size: 2MB.</p>
      </label>
      <input type="file" id={label} className="hidden" accept=".jpeg,.jpg,.png" onChange={(e) => { const selectedFile = e.target.files[0]; if (selectedFile) { setFile(selectedFile); } }} required />
    </div>
  );
}
