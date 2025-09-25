import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Contact, NotebookText, Eye } from 'lucide-react';
import { FaSignOutAlt, FaSearch } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import api from '../api/axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ASSET_BASE = (API_BASE || '').replace(/\/api$/, '');
const getAssetUrl = (p) => (p ? ASSET_BASE + p : '');

export default function Admin_GeneratedIDs() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const listRef = useRef(null);

  const [syncedHeight, setSyncedHeight] = useState(0);
  const [sidebarHover, setSidebarHover] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedId, setSelectedId] = useState(null);

  useLayoutEffect(() => {
    if (listRef.current) setSyncedHeight(listRef.current.offsetHeight);
  }, []);

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
      type: doc?.type || '',
      status: doc?.status || '',
      date: fmtDate(doc?.createdAt),
      generatedFrontImagePath: doc?.generatedFrontImagePath || doc?.generatedImagePath || '',
      generatedBackImagePath: doc?.generatedBackImagePath || '',
      photoPath: doc?.photoPath || '',
      generatedBy: doc?.generatedBy?.name || '—',
      approvedBy: doc?.approvedBy?.name || '—',
    }));
  }, [items]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return viewRows.filter((id) => {
      const matchesSearch =
        `${id.firstName} ${id.lastName}`.toLowerCase().includes(q) ||
        String(id.idNumber).toLowerCase().includes(q) ||
        id.type.toLowerCase().includes(q);

      const matchesType = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [viewRows, searchTerm, typeFilter, statusFilter]);

  function onView(row) {
    setSelectedId({ ...row });
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  }

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
            {/* List */}
            <div
              ref={listRef}
              className={`bg-white rounded-2xl shadow-md p-6 flex flex-col h-full transition-all duration-300
                ${selectedId ? 'lg:w-[60%]' : 'lg:w-full'}`}
              style={{ minHeight: `${syncedHeight || 741}px` }}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
                <div className="flex gap-3 flex-wrap items-center">
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
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
                    <input
                      type="text"
                      placeholder="Search by name, ID, or type..."
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
                          <th className="p-4">Date</th>
                          <th className="p-4">Actions</th>
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
                                  <Eye size={16} className="cursor-pointer" onClick={() => onView(id)} />
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

            {/* Right panel */}
            {selectedId && (
              <div
                className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 transition-all duration-300"
                style={{ minHeight: `${syncedHeight}px` }}
              >
                <ViewPanel
                  row={selectedId}
                  onClose={() => setSelectedId(null)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- View Panel --- */
function ViewPanel({ row, onClose }) {
  const [side, setSide] = useState('front');
  const templateFront = getAssetUrl('/templates/id_front.png');
  const templateBack = getAssetUrl('/templates/id_back.png');
  const photoSrc = row.photoPath ? getAssetUrl(row.photoPath) : '';
  const isBackAvailable = Boolean(row.generatedBackImagePath);
  const displayTemplate = side === 'back' ? templateBack : templateFront;
  const filenameBase = `${row.firstName || 'ID'}-${row.lastName || ''}-${row.idNumber || ''}`.replace(/\s+/g, '_');

  function printCard() {
    const w = window.open('', 'PRINT', 'height=700,width=900');
    if (!w) return;
    w.document.write(`<html><head><title>Print ${filenameBase}</title></head><body style="margin:0">
      <div style="width:400px;height:250px;position:relative;">
        <img src="${displayTemplate}" style="width:100%;height:100%;position:absolute;top:0;left:0;" />
        ${photoSrc ? `<img src="${photoSrc}" style="position:absolute;top:40px;left:30px;width:80px;height:80px;border-radius:50%;" />` : ''}
        <div style="position:absolute;bottom:50px;left:30px;color:black;font-weight:bold;font-size:16px;">
          ${row.firstName} ${row.lastName}
        </div>
        <div style="position:absolute;bottom:25px;left:30px;color:black;font-size:14px;">
          ${row.idNumber} • ${row.type}
        </div>
      </div>
      <script>window.focus();window.print();window.close();</script>
    </body></html>`);
    w.document.close();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">View ID</h2>
          <p className="text-gray-600 text-sm">Preview and details.</p>
        </div>
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded ${side==='front' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setSide('front')}>Front</button>
          <button className={`px-3 py-1 rounded ${side==='back' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setSide('back')} disabled={!isBackAvailable} title={isBackAvailable ? 'Show back' : 'Back image not available'}>Back</button>
        </div>
      </div>

      <div className="border rounded-xl p-3 bg-gray-50 w-full flex justify-center">
        <div className="relative w-80 h-52 rounded-lg overflow-hidden">
          <img src={displayTemplate} alt="Template" className="absolute inset-0 w-full h-full object-cover" />
          {photoSrc && <img src={photoSrc} alt="User" className="absolute top-4 left-4 w-20 h-20 object-cover rounded-full border-2 border-white" />}
          <div className="absolute bottom-14 left-4 text-black font-bold text-lg">{row.firstName} {row.lastName}</div>
          <div className="absolute bottom-4 left-4 text-black text-sm">{row.idNumber} • {row.type}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <button onClick={printCard} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md">Print</button>
        <button onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-2 rounded-md">Close</button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <Info label="Name" value={`${row.firstName} ${row.lastName}`} />
        <Info label="ID Number" value={row.idNumber} />
        <Info label="Type" value={row.type} />
        <Info label="Status" value={row.status} />
        <Info label="Date Generated" value={row.date} />
        <Info label="Generated By" value={row.generatedBy} />
        <Info label="Approved By" value={row.approvedBy} />
      </div>
    </div>
  );
}

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
    <select value={value} onChange={onChange} className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm" title={label}>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
