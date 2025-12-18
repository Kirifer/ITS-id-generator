import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaIdCard, FaUserCheck, FaClipboardList, FaTasks } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import IDTable from '../components/GeneratedIDs/IDtable';
import ViewPanel from '../components/GeneratedIDs/ViewPanel';
import FilterBar from '../components/GeneratedIDs/FilterBar';
import { idCardStore } from '../store/cardStore';
import { fmtDate } from '../utils/dateFormatter';

export default function DashboardHR() {
  const mainRef = useRef(null);
  const tableRef = useRef(null);

  const { items, loading, error, message, getIdCards } = idCardStore();
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

  const total = items.length;
  const approved = useMemo(() => items.filter(i => i.status === 'Approved').length, [items]);
  const pending = useMemo(() => items.filter(i => i.status === 'Pending').length, [items]);
  const actions = pending;

  const viewRows = useMemo(() =>
    items.map(doc => ({
      _id: doc._id,
      firstName: doc?.fullName?.firstName || '',
      middleInitial: doc?.fullName?.middleInitial || '',
      lastName: doc?.fullName?.lastName || '',
      employeeNumber: doc?.employeeNumber || '',
      position: doc?.position || '',
      type: doc?.type || '',
      status: doc?.status || '',
      email: doc?.contactDetails?.email || '',
      phone: doc?.contactDetails?.phone || '',
      date: fmtDate(doc?.createdAt),
      emFirstName: doc?.emergencyContact?.firstName || '',
      emMiddleInitial: doc?.emergencyContact?.middleInitial || '',
      emLastName: doc?.emergencyContact?.lastName || '',
      emPhone: doc?.emergencyContact?.phone || '',
      hrName: doc?.hrDetails?.name || '',
      hrPosition: doc?.hrDetails?.position || '',
      generatedFrontImagePath: doc?.generatedFrontImagePath || doc?.generatedImagePath || '',
      generatedBackImagePath: doc?.generatedBackImagePath || '',
      photoPath: doc?.photoPath || '',
    }))
  , [items]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return viewRows.filter(id => {
      const matchesSearch =
        `${id.firstName} ${id.lastName}`.toLowerCase().includes(q) ||
        String(id.employeeNumber).toLowerCase().includes(q) ||
        id.position.toLowerCase().includes(q);
      const matchesType = typeFilter === 'All' || id.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || id.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [viewRows, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [filteredData, viewMode]);

  const handleView = row => {
    setSelectedId({ ...row });
    setViewMode('view');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClose = () => {
    setSelectedId(null);
    setViewMode(null);
  };

  const panelOpen = !!selectedId;
  const sidebarExpanded = !panelOpen;
  const stats = [
    { icon: <FaIdCard size={50} />, label: 'Total Generated IDs', count: total },
    { icon: <FaUserCheck size={50} />, label: 'Approved', count: approved },
    { icon: <FaClipboardList size={50} />, label: 'Pending', count: pending },
    { icon: <FaTasks size={50} />, label: 'Actions', count: actions },
  ];

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />
      <main ref={mainRef} className="flex-1 overflow-auto custom-bg">
        <div className="p-6">
          <div className="flex flex-col gap-6 w-full max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => <StatCard key={idx} icon={stat.icon} label={stat.label} count={stat.count} />)}
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div ref={tableRef} className={`bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all duration-300 ${panelOpen ? 'lg:w-[60%]' : 'w-full'}`} style={{ height: `${tableHeight}px` }}>
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
                  err={error ? message : ''}
                  filteredData={filteredData}
                  canView={true}
                  onView={handleView}
                />
              </div>
              {panelOpen && selectedId && (
                <div className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 overflow-auto" style={{ maxHeight: `${tableHeight}px` }}>
                  <ViewPanel row={selectedId} onClose={handleClose} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}