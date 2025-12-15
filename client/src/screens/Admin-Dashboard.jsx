import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaIdCard, FaUserCheck, FaClipboardList, FaTasks, FaChevronDown, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sidebarHover, setSidebarHover] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Load data
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

  // Derived stats
  const total = items.length;
  const approvedCount = useMemo(() => items.filter(i => i.status === 'Approved').length, [items]);
  const pendingCount  = useMemo(() => items.filter(i => i.status === 'Pending').length, [items]);
  const actionsCount  = pendingCount;

  // Filtering + search
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return items.filter((id) => {
      const first = id?.fullName?.firstName || '';
      const last  = id?.fullName?.lastName || '';
      const fullName = `${first} ${last}`.trim().toLowerCase();

      const matchesSearch =
        fullName.includes(q) ||
        String(id?.idNumber || '').toLowerCase().includes(q) ||
        String(id?.position || '').toLowerCase().includes(q);

      const matchesType   = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchTerm, typeFilter, statusFilter]);

  // Approve action
  async function approve(id) {
    try {
      await api.patch(`/id-cards/${id}/approve`);
      setItems(prev => prev.map(it => it._id === id ? { ...it, status: 'Approved' } : it));
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || 'Approve failed';
      alert(msg);
    }
  }

  // Format date
  const fmtDate = (iso) => {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(+d)) return '';
    return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const sidebarExpanded = !selectedId || sidebarHover;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      />

      <main className="flex-1 p-6 custom-bg flex flex-col overflow-hidden">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />}        label="Total Generated IDs" count={total} />
          <StatCard icon={<FaUserCheck size={50} />}      label="Approved"           count={approvedCount} />
          <StatCard icon={<FaClipboardList size={50} />}  label="Pending"            count={pendingCount} />
          <StatCard icon={<FaTasks size={50} />}          label="Actions"            count={actionsCount} />
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
                  {['All', 'Approved', 'Pending', 'Rejected'].map((status, i) => (
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
                  placeholder="Search by name, ID, or position..."
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
              {loading ? (
                <div className="p-6 text-gray-600">Loading…</div>
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
                      filteredData.map((id, index) => {
                        const isLast = index === filteredData.length - 1;
                        const first = id?.fullName?.firstName || '';
                        const last  = id?.fullName?.lastName || '';
                        return (
                          <tr key={id._id || index} className="bg-white even:bg-gray-100">
                            <td className="p-4">{`${first} ${last}`}</td>
                            <td className="p-4">{id.type}</td>
                            <td className="p-4">{id.status}</td>
                            <td className="p-4">{fmtDate(id.createdAt)}</td>
                            <td
                              className={`p-4 text-purple-600 cursor-pointer hover:underline ${isLast ? 'rounded-br-2xl' : ''}`}
                              title={id.status === 'Pending' ? 'Approve' : 'View'}
                              onClick={() => id.status === 'Pending' ? approve(id._id) : null}
                            >
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
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

