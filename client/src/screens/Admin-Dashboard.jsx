import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaIdCard,
  FaUserCheck,
  FaClipboardList,
  FaTasks,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import IDTable from "../components/GeneratedIDs/IDtable";
import ViewPanel from "../components/GeneratedIDs/ViewPanel";
import FilterBar from "../components/GeneratedIDs/FilterBar";
import { idCardFilterStore } from "../store/filterStore";

export default function AdminDashboard() {
  const mainRef = useRef(null);
  const tableRef = useRef(null);
  const hasFetched = useRef(false);

  const items = idCardFilterStore((state) => state.data);
  const fetchIdCards = idCardFilterStore((state) => state.fetchIdCards);

  const [viewRow, setViewRow] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);

  const total = items.length;
  const approvedCount = useMemo(
    () => items.filter((i) => i.status === "Approved").length,
    [items]
  );
  const pendingCount = useMemo(
    () => items.filter((i) => i.status === "Pending").length,
    [items]
  );
  const actionsCount = pendingCount;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchIdCards();
    }
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [viewRow]);

  const handleView = (row) => {
    setViewRow(row);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = () => setViewRow(null);

  const panelOpen = !!viewRow;
  const sidebarExpanded = !panelOpen;
  const stats = [
    {
      icon: <FaIdCard size={50} />,
      label: "Total Generated IDs",
      count: total,
    },
    {
      icon: <FaUserCheck size={50} />,
      label: "Approved",
      count: approvedCount,
    },
    {
      icon: <FaClipboardList size={50} />,
      label: "Pending",
      count: pendingCount,
    },
    { icon: <FaTasks size={50} />, label: "Actions", count: actionsCount },
  ];

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />
      <main ref={mainRef} className="flex-1 overflow-auto custom-bg">
        <div className="p-6">
          <div className="flex flex-col gap-6 w-full max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <StatCard
                  key={idx}
                  icon={stat.icon}
                  label={stat.label}
                  count={stat.count}
                />
              ))}
            </div>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div
                ref={tableRef}
                className={`bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all duration-300 ${
                  panelOpen ? "lg:w-[60%]" : "w-full"
                }`}
                style={{ height: `${tableHeight}px` }}
              >
                <FilterBar />
                <IDTable
                  canView={true}
                  canEdit={false}
                  canDelete={false}
                  canApprove={false}
                  canReject={false}
                  onView={handleView}
                />
              </div>
              {panelOpen && viewRow && (
                <div
                  className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 overflow-auto"
                  style={{ maxHeight: `${tableHeight}px` }}
                >
                  <ViewPanel row={viewRow} onClose={handleClose} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
