// src/components/DashboardHR.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import {
  FaTh,
  FaIdCard,
  FaSignOutAlt,
  FaUserCheck,
  FaClipboardList,
  FaTasks,
  FaChevronDown,
  FaSearch,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

import logo from '../assets/images/logo.png';
import api from '../api/axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ASSET_BASE = (API_BASE || '').replace(/\/api$/, '');
const getAssetUrl = (p) => (p ? ASSET_BASE + p : '');

export default function DashboardHR() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sidebarHover, setSidebarHover] = useState(false);
  const [actionBusy, setActionBusy] = useState(null); // holds _id while approving/rejecting

  const navigate = useNavigate();

  // Helpers
  const mapDocToRow = (d) => ({
    _id: d._id,
    firstName: d?.fullName?.firstName || '',
    middleInitial: d?.fullName?.middleInitial || '',
    lastName: d?.fullName?.lastName || '',
    type: d?.type || '',
    status: d?.status || '',
    date: fmtDate(d?.createdAt),
    generatedImagePath: d?.generatedImagePath || '',
    photoPath: d?.photoPath || '',
  });

  // Load IDs
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await api.get('/id-cards'); // token added by interceptor
        if (!cancelled) setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (e?.response?.status === 401) {
          navigate('/login');
          return;
        }
        if (!cancelled) setErr(e?.response?.data?.message || e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  // Stats
  const total = items.length;
  const approved = useMemo(() => items.filter(i => i.status === 'Approved').length, [items]);
  const pending  = useMemo(() => items.filter(i => i.status === 'Pending').length, [items]);
  const rejected = useMemo(() => items.filter(i => i.status === 'Rejected').length, [items]);
  const actions  = pending;

  // View rows (flatten)
  const rows = useMemo(() => items.map(mapDocToRow), [items]);

  // Filters
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((id) => {
      const fullName = `${id.firstName} ${id.middleInitial} ${id.lastName}`.replace(/\s+/g, ' ').trim().toLowerCase();
      const matchesSearch = fullName.includes(q);
      const matchesType   = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rows, searchTerm, typeFilter, statusFilter]);

  const toggleSelectId = (row) => {
    setSelectedId((cur) => (cur && cur._id === row._id ? null : row));
  };

  // Approve / Reject
  async function doAction(row, which) {
    if (!row?._id) return;
    try {
      setActionBusy(row._id);
      const endpoint = which === 'approve' ? `/id-cards/${row._id}/approve` : `/id-cards/${row._id}/reject`;
      const res = await api.patch(endpoint);
      const updated = res.data;

      // update list
      setItems(prev => prev.map(d => (d._id === updated._id ? updated : d)));

      // update preview if open
      setSelectedId(cur => (cur && cur._id === updated._id ? mapDocToRow(updated) : cur));
    } catch (e) {
      if (e?.response?.status === 401) {
        navigate('/login'); return;
      }
      alert(e?.response?.data?.message || e.message || 'Action failed');
    } finally {
      setActionBusy(null);
    }
  }
  const approve = (row) => doAction(row, 'approve');
  const reject  = (row) => doAction(row, 'reject');

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
            <NavItem to="/approver-dashboard" icon={<FaTh />} label="Dashboard" sidebarExpanded={sidebarExpanded} />
            <NavItem to="/approver-generated-ids" icon={<FaIdCard />} label="Generated IDs" sidebarExpanded={sidebarExpanded} />
          </nav>
        </div>
        <div className="pt-6 border-t border-gray-600">
          <NavItem to="/logout" icon={<FaSignOutAlt />} label="Logout" sidebarExpanded={sidebarExpanded}/>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 transition-all duration-300 custom-bg flex flex-col overflow-hidden">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />}       label="Total Generated IDs" count={total} />
          <StatCard icon={<FaUserCheck size={50} />}     label="Approved"           count={approved} />
          <StatCard icon={<FaClipboardList size={50} />} label="Pending"            count={pending} />
          <StatCard icon={<FaTasks size={50} />}         label="Actions"            count={actions} />
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden transition-all duration-500"
          style={{ marginRight: previewMounted ? '600px' : '0' }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>
            <div className="flex gap-4 flex-wrap items-center">
              <Dropdown options={['All', 'Intern', 'Employee']} label="Type" value={typeFilter} onChange={setTypeFilter} />
              <Dropdown options={['All', 'Approved', 'Pending', 'Rejected']} label="Status" value={statusFilter} onChange={setStatusFilter} />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="border border-gray-300 rounded-lg pl-8 pr-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden rounded-2xl custom-scrollbar">
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="p-4 text-gray-600 text-sm">Loading…</div>
              ) : err ? (
                <div className="p-4 text-red-600 text-sm">{err}</div>
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
                      filteredData.map((id, index) => {
                        const isSelected = selectedId?._id === id._id;
                        const isPending = id.status === 'Pending';
                        return (
                          <tr
                            key={id._id || index}
                            className={`transition-colors duration-200 cursor-pointer ${
                              isSelected ? 'bg-purple-200' : 'bg-white even:bg-gray-100 hover:bg-purple-50'
                            }`}
                            onClick={() => toggleSelectId(id)}
                          >
                            <td className="p-4">{`${id.firstName} ${id.middleInitial} ${id.lastName}`}</td>
                            <td className="p-4">{id.type}</td>
                            <td className="p-4">{id.status}</td>
                            <td className="p-4">{id.date}</td>
                            <td className="p-4 flex items-center justify-center gap-3">
                              <button
                                title="View"
                                onClick={(e) => { e.stopPropagation(); toggleSelectId(id); }}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                <Eye size={16} />
                              </button>

                              {isPending && (
                                <>
                                  <button
                                    title="Approve"
                                    disabled={actionBusy === id._id}
                                    onClick={(e) => { e.stopPropagation(); approve(id); }}
                                    className={`text-green-600 hover:text-green-700 ${actionBusy === id._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    title="Reject"
                                    disabled={actionBusy === id._id}
                                    onClick={(e) => { e.stopPropagation(); reject(id); }}
                                    className={`text-red-600 hover:text-red-700 ${actionBusy === id._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}
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
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewMounted && selectedId && (
          <div className="fixed top-1/2 right-6 -translate-y-1/2 w-[580px] max-h-[90vh] rounded-2xl p-4 z-50 flex flex-col items-center bg-transparent overflow-y-auto transition-all duration-500">
            <div className="flex justify-end w-full mb-2">
              <button
                onClick={() => setSelectedId(null)}
                className="text-gray-600 hover:text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl flex justify-center gap-4 bg-white shadow-lg w-full">
              <div className="text-center w-full flex flex-col items-center">
                <p className="text-xs font-semibold text-gray-700 mb-1">Preview</p>
                <PreviewImage row={selectedId} />
                {selectedId.status === 'Pending' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => approve(selectedId)}
                      disabled={actionBusy === selectedId._id}
                      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded ${actionBusy === selectedId._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(selectedId)}
                      disabled={actionBusy === selectedId._id}
                      className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded ${actionBusy === selectedId._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      Reject
                    </button>
                  </div>
                )}
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
    <img src={src} alt="ID" className="object-contain w-[220px] rounded" />
  ) : (
    <div className="w-[220px] h-[140px] bg-gray-100 text-gray-400 text-xs flex items-center justify-center rounded">
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

function Dropdown({ options, label, value, onChange }) {
  return (
    <div className="relative w-fit">
      <select
        className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>{`${label}: ${opt}`}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}

function fmtDate(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(+d)) return '';
  return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
}
