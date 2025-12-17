import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import IDTable from '../components/GeneratedIDs/IDtable';
import ViewPanel from '../components/GeneratedIDs/ViewPanel';
import { idCardStore, idCardApproveStore, idCardRejectStore } from '../store/cardStore';
import { fmtDate } from '../utils/dateFormatter';
import { showMessageBox } from '../utils/messageBox';

export default function ApprovalHR() {
  const { items, loading, error, message, getIdCards } = idCardStore();
  const { idCardApprove } = idCardApproveStore();
  const { idCardReject } = idCardRejectStore();
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

  useEffect(() => {
    if (error && message) showMessageBox(message);
  }, [error, message]);

  const viewRows = useMemo(() =>
    items.map((doc) => ({
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
      generatedFrontImagePath: doc?.generatedFrontImagePath || doc?.generatedImagePath || '',
      generatedBackImagePath: doc?.generatedBackImagePath || '',
      photoPath: doc?.photoPath || '',
    }))
  , [items]);

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

  async function handleApprove(row) {
    await idCardApprove(row._id);
    getIdCards();
  }

  async function handleReject(row) {
    await idCardReject(row._id);
    getIdCards();
  }

  function handleView(row) {
    setSelectedId(row);
    setViewMode('view');
  }

  function handleEdit(row) {
    setSelectedId(row);
    setViewMode('edit');
  }

  function handleClose() {
    setSelectedId(null);
    setViewMode(null);
  }

  const err = error ? message : '';
  const panelOpen = viewMode === 'view';
  const sidebarExpanded = !panelOpen;

  return (
    <div className="flex min-h-screen">
      <Sidebar expanded={sidebarExpanded} />
      <main className="flex-1 p-6 transition-all duration-300 custom-bg flex items-center justify-center min-h-screen relative">
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col transition-all duration-500">
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
          <IDTable
            loading={loading}
            err={err}
            filteredData={filteredData}
            canView={true}
            canEdit={false}
            canDelete={false}
            canApprove={true}
            canReject={true}
            onView={handleView}
            onApprove={handleApprove}
            onReject={handleReject}
            statusBasedButtons
          />
        </div>
        {panelOpen && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <ViewPanel
                row={selectedId}
                onEdit={() => handleEdit(selectedId)}
                onClose={handleClose}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
