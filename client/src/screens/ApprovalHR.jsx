import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import IDTable from "../components/GeneratedIDs/IDtable";
import ViewPanel from "../components/GeneratedIDs/ViewPanel";
import FilterBar from "../components/GeneratedIDs/FilterBar";
import { idCardApproveStore, idCardRejectStore } from "../store/cardStore";
import { idCardFilterStore } from "../store/filterStore";
import { showMessageBox } from "../utils/messageBox";

export default function ApprovalHR() {
  const mainRef = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const hasFetched = useRef(false);

  const items = idCardFilterStore((state) => state.data);
  const fetchIdCards = idCardFilterStore((state) => state.fetchIdCards);

  const {
    loading: approveLoading,
    success: approveSuccess,
    error: approveError,
    message: approveMessage,
    idCardApprove,
    reset: approveReset,
  } = idCardApproveStore();
  const {
    loading: rejectLoading,
    success: rejectSuccess,
    error: rejectError,
    message: rejectMessage,
    idCardReject,
    reset: rejectReset,
  } = idCardRejectStore();

  const [tableHeight, setTableHeight] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchIdCards();
    }
  }, []);

  useLayoutEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [items, viewMode]);

  useEffect(() => {
    if (approveSuccess) {
      showMessageBox(approveMessage);
      approveReset();
      fetchIdCards();
      setSelectedId(null);
      setViewMode(null);
    }
    if (approveError && approveMessage) {
      showMessageBox(approveMessage);
      approveReset();
    }
  }, [
    approveSuccess,
    approveError,
    approveMessage,
    approveReset,
    fetchIdCards,
  ]);

  useEffect(() => {
    if (rejectSuccess) {
      showMessageBox(rejectMessage);
      rejectReset();
      fetchIdCards();
      setSelectedId(null);
      setViewMode(null);
    }
    if (rejectError && rejectMessage) {
      showMessageBox(rejectMessage);
      rejectReset();
    }
  }, [rejectSuccess, rejectError, rejectMessage, rejectReset, fetchIdCards]);

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
    setViewMode("view");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClose() {
    setSelectedId(null);
    setViewMode(null);
  }

  const sidebarExpanded = !selectedId || sidebarHover;
  const isActionLoading = approveLoading || rejectLoading;

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />
      <main ref={mainRef} className="flex-1 overflow-auto custom-bg">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl mx-auto items-start">
            <div
              ref={tableRef}
              className="lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all duration-300"
              style={{ height: `${tableHeight}px` }}
            >
              <FilterBar />
              <IDTable
                canView={true}
                canEdit={false}
                canDelete={false}
                canApprove={true}
                canReject={true}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                statusBasedButtons
                externalLoading={isActionLoading}
              />
            </div>
            <div
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 overflow-auto"
              style={{ maxHeight: `${tableHeight}px` }}
            >
              {viewMode === "view" && selectedId && (
                <ViewPanel row={selectedId} onClose={handleClose} />
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
