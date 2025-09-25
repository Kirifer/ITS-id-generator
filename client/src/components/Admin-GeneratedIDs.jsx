import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Contact, NotebookText, LogOut,
  User, CreditCard, Briefcase, Tag,
  Phone, UploadCloud, Eye, Pencil, Trash2, ChevronDown,
} from 'lucide-react';
import { FaChevronDown, FaSearch, FaSignOutAlt, FaDownload, FaPrint } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import api from '../api/axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
// Build absolute URL for /uploads assets served by your API
const ASSET_BASE = (API_BASE || '').replace(/\/api$/, '');
const getAssetUrl = (p) => (p ? ASSET_BASE + p : '');

export default function Admin_GeneratedIDs() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const formRef = useRef(null);
  const listRef = useRef(null);

  const [syncedHeight, setSyncedHeight] = useState(0);
  const [photo, setPhoto] = useState(null);

  // which panel to show
  const [panelMode, setPanelMode] = useState(null); // 'view' | 'edit' | null
  const [sidebarHover, setSidebarHover] = useState(false);

  // LIVE DATA
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // UI filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected row (flattened view shape)
  const [selectedId, setSelectedId] = useState(null);

  useLayoutEffect(() => {
    if (formRef.current) setSyncedHeight(formRef.current.offsetHeight);
  }, []);

  // Load items (JWT attached by axios interceptor)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const { data } = await api.get('/id-cards');
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data?.message || e.message || 'Failed to load data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const viewRows = useMemo(() => {
    return items.map(doc => ({
      _id: doc._id,
      firstName: doc?.fullName?.firstName || '',
      middleInitial: doc?.fullName?.middleInitial || '',
      lastName: doc?.fullName?.lastName || '',
      idNumber: doc?.idNumber || '',
      position: doc?.position || '',
      type: doc?.type || '',
      status: doc?.status || '',
      date: fmtDate(doc?.createdAt),
      emergencyFirstName: doc?.emergencyContact?.firstName || '',
      emergencyMiddleInitial: doc?.emergencyContact?.middleInitial || '',
      emergencyLastName: doc?.emergencyContact?.lastName || '',
      emergencyContactNumber: doc?.emergencyContact?.phone || '',
      // NEW: map both sides
      generatedFrontImagePath: doc?.generatedFrontImagePath || doc?.generatedImagePath || '',
      generatedBackImagePath:  doc?.generatedBackImagePath  || '',
      photoPath: doc?.photoPath || '',
    }));
  }, [items]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return viewRows.filter((id) => {
      const matchesSearch =
        `${id.firstName} ${id.lastName}`.toLowerCase().includes(q) ||
        String(id.idNumber).toLowerCase().includes(q) ||
        id.position.toLowerCase().includes(q);

      const matchesType = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [viewRows, searchTerm, typeFilter, statusFilter]);

  // View / Edit handlers
  function onView(row) {
    setSelectedId({ ...row });
    setPanelMode('view');
    setPhoto(null);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function onEdit(row) {
    setSelectedId({ ...row });
    setPanelMode('edit');
    setPhoto(null);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Simple message box
  const showMessageBox = (message, onClose) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background-color: rgba(0,0,0,.5);
      z-index: 9998; display:flex; align-items:center; justify-content:center;`;
    const box = document.createElement('div');
    box.style.cssText = `
      background:white; padding:20px 30px; border-radius:10px;
      box-shadow:0 4px 12px rgba(0,0,0,.15); text-align:center; font-family:'Poppins',sans-serif; z-index:9999;`;
    const p = document.createElement('p');
    p.textContent = message;
    p.style.cssText = `font-size:1rem; margin-bottom:10px; color:#000; font-weight:300;`;
    const btn = document.createElement('button');
    btn.textContent = 'Close';
    btn.style.cssText = `padding:8px 16px; background:#8A2BE2; color:white; border:none; border-radius:5px; cursor:pointer;`;
    btn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      if (typeof onClose === 'function') onClose();
    });
    box.appendChild(p); box.appendChild(btn); overlay.appendChild(box);
    document.body.appendChild(overlay);
  };

  // Update (PATCH JSON)
  async function onSubmitUpdate(e) {
    e.preventDefault();
    if (!selectedId?._id) return;

    const payload = {
      fullName: {
        firstName: selectedId.firstName,
        middleInitial: selectedId.middleInitial,
        lastName: selectedId.lastName,
      },
      idNumber: selectedId.idNumber,
      position: selectedId.position,
      type: selectedId.type,
      emergencyContact: {
        firstName: selectedId.emergencyFirstName,
        middleInitial: selectedId.emergencyMiddleInitial,
        lastName: selectedId.emergencyLastName,
        phone: selectedId.emergencyContactNumber,
      },
    };

    try {
      const { data: updated } = await api.patch(`/id-cards/${selectedId._id}`, payload);

      // Merge + switch to view
      setItems(prev => prev.map(d => d._id === updated._id ? updated : d));

      const mapped = {
        _id: updated._id,
        firstName: updated?.fullName?.firstName || '',
        middleInitial: updated?.fullName?.middleInitial || '',
        lastName: updated?.fullName?.lastName || '',
        idNumber: updated?.idNumber || '',
        position: updated?.position || '',
        type: updated?.type || '',
        status: updated?.status || '',
        date: fmtDate(updated?.createdAt),
        emergencyFirstName: updated?.emergencyContact?.firstName || '',
        emergencyMiddleInitial: updated?.emergencyContact?.middleInitial || '',
        emergencyLastName: updated?.emergencyContact?.lastName || '',
        emergencyContactNumber: updated?.emergencyContact?.phone || '',
        generatedFrontImagePath: updated?.generatedFrontImagePath || updated?.generatedImagePath || '',
        generatedBackImagePath:  updated?.generatedBackImagePath  || '',
        photoPath: updated?.photoPath || '',
      };

      setSelectedId(mapped);
      setPanelMode('view');
      setPhoto(null);
      showMessageBox('ID Details Updated!');
    } catch (e) {
      showMessageBox(e?.response?.data?.message || e.message || 'Update failed');
    }
  }

  // Delete (DELETE)
  async function onDelete(row) {
    if (!window.confirm(`Delete ${row.firstName} ${row.lastName}?`)) return;
    try {
      await api.delete(`/id-cards/${row._id}`);
      setItems(prev => prev.filter(d => d._id !== row._id));
      setSelectedId(cur => (cur && cur._id === row._id ? null : cur));
      setPanelMode(cur => (selectedId && selectedId._id === row._id ? null : cur));
    } catch (e) {
      showMessageBox(e?.response?.data?.message || e.message || 'Delete failed');
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  }

  const previewMounted = Boolean(selectedId) && !sidebarHover;
  const sidebarExpanded = !selectedId || sidebarHover;

  return (
    <div className="flex h-screen w-screen font-inter">
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-1 rounded-md hover:text-purple-300"
            title="Logout"
          >
            <FaSignOutAlt />
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-auto">
        <div className="flex justify-center items-center min-h-screen p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl items-stretch">
            {/* List (left) */}
            <div
              ref={listRef}
              className="lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col h-full"
              style={{ minHeight: `${syncedHeight || 741}px` }}
            >
              {/* Header: filters/search */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

                <div className="flex gap-3 flex-wrap items-center">
                  {/* Filters */}
                  <Dropdown
                    label="Type"
                    options={['All', 'Intern', 'Employee']}
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  />
                  <Dropdown
                    label="Status"
                    options={['All', 'Approved', 'Pending', 'Rejected']}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />

                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
                    <input
                      type="text"
                      placeholder="Search by name, ID, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden flex flex-col h-full">
                <div className="overflow-y-auto custom-scrollbar" style={{ height: '630px' }}>
                  {loading ? (
                    <div className="p-6 text-gray-600 text-sm">Loading…</div>
                  ) : err ? (
                    <div className="p-6 text-red-600 text-sm">{err}</div>
                  ) : (
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
                          filteredData.map((id, index) => (
                            <tr key={id._id || index} className="bg-white even:bg-gray-100">
                              <td className="p-4">{id.firstName} {id.lastName}</td>
                              <td className="p-4">{id.type}</td>
                              <td className="p-4">{id.status}</td>
                              <td className="p-4">{id.date}</td>
                              <td className="p-4 text-purple-600">
                                <div className="flex justify-center gap-3">
                                  <Eye   size={16} className="cursor-pointer" onClick={() => onView(id)} />
                                  <Pencil size={16} className="cursor-pointer" onClick={() => onEdit(id)} />
                                  <Trash2 size={16} className="cursor-pointer" onClick={() => onDelete(id)} />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-4 text-gray-500 italic">No matching results.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Right panel (dynamic) */}
            <div
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6"
              style={{ minHeight: `${syncedHeight}px` }}
            >
              {panelMode === 'view' && selectedId && (
                <ViewPanel
                  row={selectedId}
                  onEdit={() => onEdit(selectedId)}
                  onClose={() => { setSelectedId(null); setPanelMode(null); }}
                />
              )}

              {panelMode === 'edit' && selectedId && (
                <>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Details:</h2>
                    <p className="text-gray-600 text-sm">Please provide the required information below.</p>
                  </div>
                  <form className="space-y-4" onSubmit={onSubmitUpdate}>
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
                      <SelectWithIcon Icon={Briefcase} value={selectedId.position} onChange={(e) => setSelectedId({ ...selectedId, position: e.target.value })} label="Position" options={['Full Stack Developer','Human Resources','Marketing','Creative','SEO']} required />
                      <SelectWithIcon Icon={Tag} value={selectedId.type} onChange={(e) => setSelectedId({ ...selectedId, type: e.target.value })} label="Type" options={['Intern','Employee']} required />
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

                    {/* Photo Upload (local-only preview; server-side needs multipart PATCH) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
                      <div
                        className="flex flex-col items-center justify-center p-6 mb-7 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 cursor-pointer transition-colors duration-200 hover:border-purple-300 hover:text-purple-400"
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
                            // To actually upload, use a multipart PATCH endpoint on server
                          }}
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-4">
                      <button type="submit" className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg">
                        Update
                      </button>
                      <button type="button" onClick={() => { setSelectedId(null); setPanelMode(null); setPhoto(null); }} className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-3 rounded-md transition duration-200 text-lg">
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}

              {!panelMode && (
                <p className="text-gray-800 text-sm font-extrabold">Select an ID to view or edit.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- View panel component --- */
function ViewPanel({ row, onEdit, onClose }) {
  const [side, setSide] = React.useState('front');

  // Only front may fall back to photo; back must not.
  const path = side === 'back'
    ? (row.generatedBackImagePath || '')                // no fallback to photo
    : (row.generatedFrontImagePath || row.photoPath);   // front may fallback

  const src = path ? getAssetUrl(path) : '';
  const filenameBase = `${row.firstName || 'ID'}-${row.lastName || ''}-${row.idNumber || ''}`.replace(/\s+/g, '_');

  function printImage(url) {
    const w = window.open('', 'PRINT', 'height=700,width=900');
    if (!w) return;
    w.document.write(`<html><head><title>Print ${filenameBase}</title></head><body style="margin:0">
      <img src="${url}" style="width:100%;max-width:100%" onload="window.focus();window.print();window.close();" />
    </body></html>`);
    w.document.close();
  }

  const backAvailable = Boolean(row.generatedBackImagePath);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">View ID</h2>
          <p className="text-gray-600 text-sm">Preview and details.</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${side==='front' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSide('front')}
          >Front</button>
          <button
            className={`px-3 py-1 rounded ${side==='back' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSide('back')}
            disabled={!backAvailable}
            title={backAvailable ? 'Show back' : 'Back image not available'}
          >Back</button>
        </div>
      </div>

      <div className="border rounded-xl p-3 bg-gray-50">
        {src ? (
          <img src={src} alt="ID" className="w-full h-auto max-h-80 object-contain rounded-lg" />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            {side === 'back' ? 'No back image available' : 'No image available'}
          </div>
        )}
      </div>

      {/* Download / Print for selected side */}
      <div className="mt-3 flex gap-3">
        {src && (
          <>
            <a
              href={src}
              download={`${filenameBase}-${side}.png`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
              title="Download"
            >
              Download ({side})
            </a>
            <button
              onClick={() => printImage(src)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
              title="Print"
            >
              Print ({side})
            </button>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <Info label="Name" value={`${row.firstName} ${row.middleInitial ? row.middleInitial + '. ' : ''}${row.lastName}`} />
        <Info label="ID Number" value={row.idNumber} />
        <Info label="Position" value={row.position} />
        <Info label="Type" value={row.type} />
        <Info label="Status" value={row.status} />
        <Info label="Date Generated" value={row.date} />
        <Info label="Emergency Contact" value={`${row.emergencyFirstName} ${row.emergencyMiddleInitial ? row.emergencyMiddleInitial + '. ' : ''}${row.emergencyLastName}`} />
        <Info label="Emergency Phone" value={row.emergencyContactNumber} />
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onEdit} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md">
          Edit
        </button>
        <button onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-2 rounded-md">
          Close
        </button>
      </div>
    </div>
  );
}

/* --- Small helpers/components --- */
function Info({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-medium text-gray-800 break-words">{value || '—'}</div>
    </div>
  );
}

function NavItem({ icon, label, to, sidebarExpanded }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-3 rounded-md transition-colors duration-200 justify-start ${isActive ? 'bg-[#3E3862] text-white' : 'hover:text-purple-400'}`
      }
      title={label} // show tooltip on hover when collapsed
    >
      <div className="flex-shrink-0">
        {React.cloneElement(icon, { size: 24 })} {/* fixed icon size */}
      </div>
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${sidebarExpanded ? 'opacity-100 w-auto ml-2' : 'opacity-0 w-0 ml-0'}`}
      >
        {label}
      </span>
    </NavLink>
  );
}


function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="relative w-fit">
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
        className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {options.map((option, i) => (<option key={i}>{option}</option>))}
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
          {options.map((option, i) => (<option key={i} value={option}>{option}</option>))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>
  );
}

// Helpers
function fmtDate(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(+d)) return '';
  return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
}
