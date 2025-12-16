import React, { useEffect, useMemo, useState } from 'react';
import { FaIdCard, FaUserCheck, FaClipboardList, FaTasks } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { idCardStore, idCardApproveStore } from '../store/cardStore';
import StatCard from '../components/StatCard';
import IDTable from '../components/GeneratedIDs/IDtable';
import FilterBar from '../components/GeneratedIDs/FilterBar';

export default function AdminDashboard() {
  const { loading, error, items, getIdCards } = idCardStore((state) => state);
  const { loading: approveLoading, success: approveSuccess, error: approveError, message: approveMessage, idCardApprove } = idCardApproveStore((state) => state);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sidebarHover, setSidebarHover] = useState(false);

  const fmtDate = (iso) => {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(+d)) return '';
    return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

  const total = items.length;
  const approvedCount = useMemo(() => items.filter(i => i.status === 'Approved').length, [items]);
  const pendingCount  = useMemo(() => items.filter(i => i.status === 'Pending').length, [items]);
  const actionsCount  = pendingCount;

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
    }).map(id => ({
      ...id,
      firstName: id?.fullName?.firstName || '',
      lastName: id?.fullName?.lastName || '',
      date: fmtDate(id.createdAt) 
    }));
  }, [items, searchTerm, typeFilter, statusFilter]);

  const handleView = (id) => {
    console.log('View:', id);
  };

  const handleEdit = (id) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaIdCard size={50} />}        label="Total Generated IDs" count={total} />
          <StatCard icon={<FaUserCheck size={50} />}      label="Approved"           count={approvedCount} />
          <StatCard icon={<FaClipboardList size={50} />}  label="Pending"            count={pendingCount} />
          <StatCard icon={<FaTasks size={50} />}          label="Actions"            count={actionsCount} />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <IDTable
            loading={loading}
            err={error}
            filteredData={filteredData}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
