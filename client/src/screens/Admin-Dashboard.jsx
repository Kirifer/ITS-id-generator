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

  const { data: items, loading, error, fetchIdCards } = idCardFilterStore();
  const [viewRow, setViewRow] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);

  useEffect(() => {
    fetchIdCards();
  }, [fetchIdCards]);

  const fmtDate = (iso) => {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(+d)) return "";
    return d.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

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

  const tableData = useMemo(() => {
    return items.map((id) => ({
      _id: id._id,
      firstName: id?.fullName?.firstName || "",
      middleInitial: id?.fullName?.middleInitial || "",
      lastName: id?.fullName?.lastName || "",
      employeeNumber: id?.employeeNumber || "",
      position: id?.position || "",
      type: id?.type || "",
      status: id?.status || "",
      email: id?.contactDetails?.email || "",
      phone: id?.contactDetails?.phone || "",
      date: fmtDate(id.createdAt),
      emFirstName: id?.emergencyContact?.firstName || "",
      emMiddleInitial: id?.emergencyContact?.middleInitial || "",
      emLastName: id?.emergencyContact?.lastName || "",
      emPhone: id?.emergencyContact?.phone || "",
      hrName: id?.hrDetails?.name || "",
      hrPosition: id?.hrDetails?.position || "",
      generatedFrontImagePath:
        id?.generatedFrontImagePath || id?.generatedImagePath || "",
      generatedBackImagePath: id?.generatedBackImagePath || "",
      photoPath: id?.photoPath || "",
    }));
  }, [items]);

  useEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [tableData, viewRow]);

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
                  loading={loading}
                  err={error}
                  filteredData={tableData}
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
