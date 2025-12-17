import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sidebar from "../components/Sidebar";
import IDTable from "../components/GeneratedIDs/IDtable";
import ViewPanel from "../components/GeneratedIDs/ViewPanel";
import EditPanel from "../components/GeneratedIDs/EditPannel";
import FilterBar from "../components/GeneratedIDs/FilterBar";
import { showMessageBox } from "../utils/messageBox";
import { fmtDate } from "../utils/dateFormatter";
import {
  idCardStore,
  idCardDeleteStore,
  idCardUpdateStore,
} from "../store/cardStore";

export default function Admin_GeneratedIDs() {
  const mainRef = useRef(null);
  const formRef = useRef(null);
  const tableRef = useRef(null);

  const { items, loading, error, message, getIdCards } = idCardStore();
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
    message: deleteMessage,
    idCardDelete,
    reset: deleteReset,
  } = idCardDeleteStore();
  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
    message: updateMessage,
    idCardUpdate,
    reset: updateReset,
  } = idCardUpdateStore();

  const [tableHeight, setTableHeight] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [panelMode, setPanelMode] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  useLayoutEffect(() => {
    if (tableRef.current) {
      const offsetTop = tableRef.current.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const calculatedHeight = viewportHeight - offsetTop - 24;
      setTableHeight(calculatedHeight);
    }
  }, [items, panelMode]);

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);
  useEffect(() => {
    if (error && message) showMessageBox(message);
  }, [error, message]);

  useEffect(() => {
    if (updateSuccess) {
      showMessageBox(updateMessage);
      updateReset();
      setPanelMode("view");
      setPhoto(null);
    }
    if (updateError && updateMessage) {
      showMessageBox(updateMessage);
      updateReset();
    }
  }, [updateSuccess, updateError, updateMessage, updateReset]);

  useEffect(() => {
    if (deleteSuccess) {
      showMessageBox(deleteMessage);
      deleteReset();
      idCardStore.setState((state) => ({
        items: state.items.filter((d) => d._id !== selectedId?._id),
      }));
      setSelectedId(null);
      setPanelMode(null);
    }
    if (deleteError && deleteMessage) {
      showMessageBox(deleteMessage);
      deleteReset();
    }
  }, [deleteSuccess, deleteError, deleteMessage, deleteReset, selectedId]);

  const viewRows = useMemo(
    () =>
      items.map((doc) => ({
        _id: doc._id,
        firstName: doc?.fullName?.firstName || "",
        middleInitial: doc?.fullName?.middleInitial || "",
        lastName: doc?.fullName?.lastName || "",
        idNumber: doc?.idNumber || "",
        position: doc?.position || "",
        type: doc?.type || "",
        status: doc?.status || "",
        date: fmtDate(doc?.createdAt),
        emergencyFirstName: doc?.emergencyContact?.firstName || "",
        emergencyMiddleInitial: doc?.emergencyContact?.middleInitial || "",
        emergencyLastName: doc?.emergencyContact?.lastName || "",
        emergencyContactNumber: doc?.emergencyContact?.phone || "",
        generatedFrontImagePath:
          doc?.generatedFrontImagePath || doc?.generatedImagePath || "",
        generatedBackImagePath: doc?.generatedBackImagePath || "",
        photoPath: doc?.photoPath || "",
      })),
    [items]
  );

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return viewRows.filter((id) => {
      const matchesSearch =
        `${id.firstName} ${id.lastName}`.toLowerCase().includes(q) ||
        String(id.idNumber).toLowerCase().includes(q) ||
        id.position.toLowerCase().includes(q);
      const matchesType = typeFilter === "All" || id.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || id.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [viewRows, searchTerm, typeFilter, statusFilter]);

  function onView(row) {
    setSelectedId({ ...row });
    setPanelMode("view");
    setPhoto(null);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }
  function onEdit(row) {
    setSelectedId({ ...row });
    setPanelMode("edit");
    setPhoto(null);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function onSubmitUpdate(e) {
    e.preventDefault();
    if (!selectedId?._id) return;
    const payload = {
      fullName: {
        firstName: selectedId.firstName,
        middleInitial: selectedId.middleInitial,
        lastName: selectedId.lastName,
      },
      idNumber: selectedId.idNumber,
      position: selectedId.position,
      type: selectedId.type,
      emergencyContact: {
        firstName: selectedId.emergencyFirstName,
        middleInitial: selectedId.emergencyMiddleInitial,
        lastName: selectedId.emergencyLastName,
        phone: selectedId.emergencyContactNumber,
      },
    };
    try {
      await idCardUpdate(payload, selectedId._id);
      const updatedItem = {
        ...selectedId,
        ...payload,
        fullName: payload.fullName,
        emergencyContact: payload.emergencyContact,
      };
      idCardStore.setState((state) => ({
        items: state.items.map((d) =>
          d._id === selectedId._id ? updatedItem : d
        ),
      }));
      setSelectedId(updatedItem);
    } catch (e) {}
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete ${row.firstName} ${row.lastName}?`)) return;
    try {
      await idCardDelete(row._id);
    } catch (e) {}
  }

  const sidebarExpanded = !selectedId || sidebarHover;
  const isActionLoading = loading || deleteLoading || updateLoading;

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
                err={error ? message : ""}
                filteredData={filteredData}
                canView
                canEdit
                canDelete
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
            <div
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6 overflow-auto"
              style={{ maxHeight: `${tableHeight}px` }}
            >
              {panelMode === "view" && selectedId && (
                <ViewPanel
                  row={selectedId}
                  onEdit={() => onEdit(selectedId)}
                  onClose={() => {
                    setSelectedId(null);
                    setPanelMode(null);
                  }}
                />
              )}
              {panelMode === "edit" && selectedId && (
                <EditPanel
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  photo={photo}
                  setPhoto={setPhoto}
                  onSubmit={onSubmitUpdate}
                  onCancel={() => {
                    setSelectedId(null);
                    setPanelMode(null);
                    setPhoto(null);
                  }}
                />
              )}
              {!panelMode && (
                <p className="text-gray-800 text-sm font-extrabold">
                  Select an ID to view or edit.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
