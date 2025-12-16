// src/components/DashboardHR.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FaIdCard, FaUserCheck, FaClipboardList, FaTasks } from 'react-icons/fa';

import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import IDTable from '../components/GeneratedIDs/IDtable';
import FilterBar from '../components/GeneratedIDs/FilterBar';
import { idCardStore } from '../store/cardStore';

export default function DashboardHR() {
  const { items, loading, error, message, getIdCards, approveIdCard, rejectIdCard } = idCardStore();
  
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sidebarHover, setSidebarHover] = useState(false);
  const [actionBusy, setActionBusy] = useState(null);

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

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

  const total = items.length;
  const approved = useMemo(() => items.filter(i => i.status === 'Approved').length, [items]);
  const pending = useMemo(() => items.filter(i => i.status === 'Pending').length, [items]);
  const rejected = useMemo(() => items.filter(i => i.status === 'Rejected').length, [items]);
  const actions = pending;

  const rows = useMemo(() => items.map(mapDocToRow), [items]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return rows.filter((id) => {
      const fullName = `${id.firstName} ${id.middleInitial} ${id.lastName}`.replace(/\s+/g, ' ').trim().toLowerCase();
      const matchesSearch = fullName.includes(q);
      const matchesType = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rows, searchTerm, typeFilter, statusFilter]);

  const approve = async (row) => {
    if (!row?._id) return;
    setActionBusy(row._id);
    await approveIdCard(row._id);
    setActionBusy(null);
    const updated = items.find(d => d._id === row._id);
    if (updated && selectedId?._id === row._id) {
      setSelectedId(mapDocToRow(updated));
    }
  };

  const reject = async (row) => {
    if (!row?._id) return;
    setActionBusy(row._id);
    await rejectIdCard(row._id);
    setActionBusy(null);
    const updated = items.find(d => d._id === row._id);
    if (updated && selectedId?._id === row._id) {
      setSelectedId(mapDocToRow(updated));
    }
  };

  const previewMounted = Boolean(selectedId) && !sidebarHover;

  const stats = [
    { icon: <FaIdCard size={50} />, label: 'Total Generated IDs', count: total },
    { icon: <FaUserCheck size={50} />, label: 'Approved', count: approved },
    { icon: <FaClipboardList size={50} />, label: 'Pending', count: pending },
    { icon: <FaTasks size={50} />, label: 'Actions', count: actions },
  ];

  const err = error ? message : '';

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        sidebarHover={sidebarHover}
        setSidebarHover={setSidebarHover}
        selectedId={selectedId}
        role="approver"
      />

      <main className="flex-1 p-6 transition-all duration-300 custom-bg flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} icon={stat.icon} label={stat.label} count={stat.count} />
          ))}
        </div>

        <div
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col flex-1 overflow-hidden transition-all duration-500"
          style={{ marginRight: previewMounted ? '600px' : '0' }}
        >
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
            err={err}
            filteredData={filteredData}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            approve={approve}
            reject={reject}
            actionBusy={actionBusy}
            previewMounted={previewMounted}
          />
        </div>
      </main>
    </div>
  );
}

function fmtDate(iso) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(+d)) return '';
  return d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
}