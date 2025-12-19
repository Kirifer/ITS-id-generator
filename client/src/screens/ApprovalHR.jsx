import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import IDTable from '../components/GeneratedIDs/IDtable';
import ViewPanel from '../components/GeneratedIDs/ViewPanel';
import FilterBar from '../components/GeneratedIDs/FilterBar';
import { idCardStore, idCardApproveStore, idCardRejectStore } from '../store/cardStore';
import { fmtDate } from '../utils/dateFormatter';
import { showMessageBox } from '../utils/messageBox';

export default function ApprovalHR() {
  const mainRef = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);

  const { items, loading, error, message, getIdCards } = idCardStore();
  const { 
    loading: approveLoading,
    success: approveSuccess,
    error: approveError,
    message: approveMessage,
    idCardApprove,
    reset: approveReset 
  } = idCardApproveStore();
  const { 
    loading: rejectLoading,
    success: rejectSuccess,
    error: rejectError,
    message: rejectMessage,
    idCardReject,
    reset: rejectReset 
  } = idCardRejectStore();

  const [tableHeight, setTableHeight] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useLayoutEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [items, viewMode]);

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

  useEffect(() => {
    if (error && message) showMessageBox(message);
  }, [error, message]);

  useEffect(() => {
    if (approveSuccess) {
      showMessageBox(approveMessage);
      approveReset();
      getIdCards();
      setSelectedId(null);
      setViewMode(null);
    }
    if (approveError && approveMessage) {
      showMessageBox(approveMessage);
      approveReset();
    }
  }, [approveSuccess, approveError, approveMessage, approveReset, getIdCards]);

  useEffect(() => {
    if (rejectSuccess) {
      showMessageBox(rejectMessage);
      rejectReset();
      getIdCards();
      setSelectedId(null);
      setViewMode(null);
    }
    if (rejectError && rejectMessage) {
      showMessageBox(rejectMessage);
      rejectReset();
    }
  }, [rejectSuccess, rejectError, rejectMessage, rejectReset, getIdCards]);

  const viewRows = useMemo(() =>
    items.map(doc => ({
      _id: doc._id,
      firstName: doc?.fullName?.firstName || '',
      middleInitial: doc?.fullName?.middleInitial || '',
      lastName: doc?.fullName?.lastName || '',
      idNumber: doc?.idNumber || '',
      employeeNumber: doc?.employeeNumber || '',
      position: doc?.position || '',
      type: doc?.type || '',
      status: doc?.status || '',
      templateVersion: doc?.templateVersion || '',
      date: fmtDate(doc?.createdAt),
      issuedAt: doc?.issuedAt ? fmtDate(doc.issuedAt) : '',
      email: doc?.contactDetails?.email || '',
      phone: doc?.contactDetails?.phone || '',
      // Fixed property names to match ViewPanel expectations
      emFirstName: doc?.emergencyContact?.firstName || '',
      emMiddleInitial: doc?.emergencyContact?.middleInitial || '',
      emLastName: doc?.emergencyContact?.lastName || '',
      emPhone: doc?.emergencyContact?.phone || '',
      generatedFrontImagePath: doc?.generatedFrontImagePath || doc?.generatedImagePath || '',
      generatedBackImagePath: doc?.generatedBackImagePath || '',
      photoPath: doc?.photoPath || '',
      hrName: doc?.hrDetails?.name || '',
      hrPosition: doc?.hrDetails?.position || '',
      hrSignaturePath: doc?.hrDetails?.signaturePath || '',
      approvedBy: doc?.approvedBy || '',
      createdBy: doc?.createdBy || '',
      createdAt: doc?.createdAt || '',
      updatedAt: doc?.updatedAt || '',
    }))
  , [items]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return viewRows.filter(id => {
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
    try {
      await idCardApprove(row._id);
    } catch (e) {}
  }

  async function handleReject(row) {
    try {
      await idCardReject(row._id);
    } catch (e) {}
  }

  function handleView(row) {
    setSelectedId({ ...row });
    setViewMode('view');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleEdit(row) {
    setSelectedId({ ...row });
    setViewMode('edit');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleClose() {
    setSelectedId(null);
    setViewMode(null);
  }

  const sidebarExpanded = !selectedId || sidebarHover;
  const isActionLoading = loading || approveLoading || rejectLoading;

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />
      <main ref={mainRef} className="flex-1 overflow-auto custom-bg">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl mx-auto items-start">
            <div ref={tableRef} className={`lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all duration-300`} style={{ height: `${tableHeight}px` }}>
              <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
              <IDTable
                loading={isActionLoading}
                err={error ? message : ''}
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
            <div ref={formRef} className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 overflow-auto" style={{ maxHeight: `${tableHeight}px` }}>
              {viewMode === 'view' && selectedId && (
                <ViewPanel
                  row={selectedId}
                  onClose={handleClose}
                />
              )}
              {!viewMode && (
                <p className="text-gray-800 text-sm font-extrabold">
                  Select an ID to view details.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}