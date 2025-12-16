import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { FaTh, FaIdCard, FaSignOutAlt, FaCheck, FaTimes } from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import api from '../api/axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ASSET_BASE = (API_BASE || '').replace(/\/api$/, '');
const getAssetUrl = (p) => (p ? ASSET_BASE + p : '');

export default function ApprovalHR() {
  // Live data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // UI state
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Pending'); // default Pending for approver
  const [sidebarHover, setSidebarHover] = useState(false);
  const [previewClosed, setPreviewClosed] = useState(false);
  const [hideForHover, setHideForHover] = useState(false);
  const hoverTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Fetch
  // useEffect(() => {
  //   let cancelled = false;
  //   (async () => {
  //     setLoading(true);
  //     setErr('');
  //     try {
  //       const res = await api.get('/id-cards'); // Authorization auto-added by interceptor
  //       if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []);
  //     } catch (e) {
  //       if (e?.response?.status === 401) {
  //         // No token/expired → back to login
  //         navigate('/login');
  //         return;
  //       }
  //       if (!cancelled) setErr(e?.response?.data?.message || e.message || 'Failed to load');
  //     } finally {
  //       if (!cancelled) setLoading(false);
  //     }
  //   })();
  //   return () => { cancelled = true; };
  // }, [navigate]);

  // Flatten items → rows for this UI
  const rows = useMemo(() => {
    return items.map(doc => ({
      _id: doc._id,
      firstName: doc?.fullName?.firstName || '',
      middleInitial: doc?.fullName?.middleInitial || '',
      lastName: doc?.fullName?.lastName || '',
      type: doc?.type || '',
      status: doc?.status || '',
      date: fmtDate(doc?.createdAt),
      generatedImagePath: doc?.generatedImagePath || '',
      photoPath: doc?.photoPath || '',
    }));
  }, [items]);

  // Filters
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      const fullName = `${r.firstName} ${r.middleInitial} ${r.lastName}`.replace(/\s+/g, ' ').trim().toLowerCase();
      const matchesSearch = fullName.includes(q);
      const matchesType   = typeFilter === 'All' || r.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rows, searchTerm, typeFilter, statusFilter]);

  // Approve / Reject
  async function handleApprove(row) {
    try {
      const res = await api.patch(`/id-cards/${row._id}/approve`);
      const updated = res.data;
      setItems(prev => prev.map(d => d._id === updated._id ? updated : d));
      if (selectedId?._id === row._id) setSelectedId(mapDoc(updated));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Approve failed');
    }
  }
  async function handleReject(row) {
    try {
      const res = await api.patch(`/id-cards/${row._id}/reject`);
      const updated = res.data;
      setItems(prev => prev.map(d => d._id === updated._id ? updated : d));
      if (selectedId?._id === row._id) setSelectedId(mapDoc(updated));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Reject failed');
    }
  }

  function toggleSelectId(row) {
    if (selectedId?._id === row._id) {
      setSelectedId(null);
      setPreviewClosed(false);
    } else {
      setSelectedId(row);
      setPreviewClosed(false);
    }
  }

  const previewMounted = Boolean(selectedId) && !previewClosed;
  const sidebarExpanded = !selectedId || sidebarHover;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => {
          setSidebarHover(true);
          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          setHideForHover(true);
          hoverTimerRef.current = setTimeout(() => {
            setHideForHover(false);
            hoverTimerRef.current = null;
          }, 1000);
        }}
        onMouseLeave={() => {
          setSidebarHover(false);
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          setHideForHover(false);
        }}
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
            <NavItem to="/approver-dashboard" icon={<FaTh />} label="Dashboard" sidebarExpanded={sidebarExpanded} />
            <NavItem to="/approver-generated-ids" icon={<FaIdCard />} label="Generated IDs" sidebarExpanded={sidebarExpanded} />
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/logout" icon={<FaSignOutAlt />} label="Logout" sidebarExpanded={sidebarExpanded}/>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 transition-all duration-300 custom-bg flex items-center justify-center min-h-screen relative">
        <div
          className="bg-white rounded-2xl shadow-md p-6 w-full max-w-6xl max-h-[75vh] overflow-hidden flex flex-col transition-all duration-500"
          style={{ marginRight: previewMounted ? '650px' : '0' }}
        >
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
                <option value="Rejected">Rejected</option>
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
            {loading ? (
              <div className="p-4 text-gray-600 text-sm">Loading…</div>
            ) : err ? (
              <div className="p-4 text-red-600 text-sm">{err}</div>
            ) : (
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
                    filteredData.map((row, index) => (
                      <tr
                        key={row._id || index}
                        className={`transition-colors duration-200 cursor-pointer ${
                          selectedId?._id === row._id
                            ? 'bg-purple-200'
                            : index % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        <td className="p-4">{`${row.firstName} ${row.middleInitial} ${row.lastName}`}</td>
                        <td className="p-4">{row.type}</td>
                        <td className="p-4">{row.status}</td>
                        <td className="p-4">{row.date}</td>
                        <td className="p-4 text-purple-600 flex justify-center items-center gap-3">
                          <button className="relative group" onClick={() => toggleSelectId(row)} title="View">
                            <Eye size={16} className="hover:text-purple-800 transition-colors duration-150" />
                          </button>

                          {row.status === 'Pending' && (
                            <>
                              <button className="relative group" onClick={() => handleApprove(row)} title="Approve">
                                <FaCheck className="text-green-500 hover:text-green-600" />
                              </button>
                              <button className="relative group" onClick={() => handleReject(row)} title="Reject">
                                <FaTimes className="text-red-500 hover:text-red-600" />
                              </button>
                            </>
                          )}
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
            )}
          </div>
        </div>

        {/* ID Preview (right) */}
        {previewMounted && selectedId && (
          <div
            className="fixed top-1/2 right-0 z-50 flex flex-col items-center bg-transparent transition-transform duration-500"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-full flex justify-end pr-2">
              <button
                onClick={() => setSelectedId(null)}
                className="text-gray-600 hover:text-red-500 text-lg font-bold"
                title="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl flex justify-center gap-6 bg-white shadow-lg">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-700 mb-1">Front</p>
                <PreviewImage row={selectedId} />
              </div>
              {/* If you ever add back-side generation, add another <PreviewImage/> here */}
            </div>

            <div className="w-full mt-4">
              <div className="bg-white p-3 rounded-lg shadow text-sm">
                <p className="font-semibold">Status:</p>
                <p className={selectedId.status === 'Approved' ? 'text-green-600' : selectedId.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'}>
                  {selectedId.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PreviewImage({ row }) {
  const src = getAssetUrl(row.generatedImagePath || row.photoPath);
  return src ? (
    <img
      src={src}
      alt="ID"
      className={`object-contain ${row.status === 'Pending' ? 'w-[160px]' : 'w-[140px]'} rounded`}
    />
  ) : (
    <div className="w-[160px] h-[120px] bg-gray-100 text-gray-400 text-xs flex items-center justify-center rounded">
      No image
    </div>
  );
}

function NavItem({ icon, label, to, sidebarExpanded }) {
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
      <span
        className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
          sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}

function fmtDate(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(+d)) return '';
  return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
}

function mapDoc(doc) {
  return {
    _id: doc._id,
    firstName: doc?.fullName?.firstName || '',
    middleInitial: doc?.fullName?.middleInitial || '',
    lastName: doc?.fullName?.lastName || '',
    type: doc?.type || '',
    status: doc?.status || '',
    date: fmtDate(doc?.createdAt),
    generatedImagePath: doc?.generatedImagePath || '',
    photoPath: doc?.photoPath || '',
  };
}
