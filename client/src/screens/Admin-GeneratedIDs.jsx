import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Sidebar from "../components/Sidebar";
import IDTable from "../components/GeneratedIDs/IDtable";
import ViewPanel from "../components/GeneratedIDs/ViewPannel";
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
  const listRef = useRef(null);

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

  const [syncedHeight, setSyncedHeight] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [panelMode, setPanelMode] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedId, setSelectedId] = useState(null);

  useLayoutEffect(() => {
    if (formRef.current) setSyncedHeight(formRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    getIdCards();
  }, [getIdCards]);

  useEffect(() => {
    if (error && message) {
      showMessageBox(message);
    }
  }, [error, message]);

  useEffect(() => {
    if (updateSuccess) {
      showMessageBox(updateMessage);
      updateReset();
      if (selectedId) {
        setSelectedId((prev) => ({ ...prev, ...selectedId }));
      }
      setPanelMode("view");
      setPhoto(null);
    }
    if (updateError && updateMessage) {
      showMessageBox(updateMessage);
      updateReset();
    }
  }, [updateSuccess, updateError, updateMessage, updateReset, selectedId]);

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

  const viewRows = useMemo(() => {
    return items.map((doc) => ({
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
    }));
  }, [items]);

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
    console.log(selectedId._id)
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

      if (!updateError) {
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
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function onDelete(row) {
    if (!window.confirm(`Delete ${row.firstName} ${row.lastName}?`)) return;

    try {
      await idCardDelete(row._id);
    } catch (e) {
    }
  }

  const sidebarExpanded = !selectedId || sidebarHover;
  const isActionLoading = loading || deleteLoading || updateLoading;

  return (
    <div className="flex h-screen w-screen font-inter">
      <Sidebar
        expanded={sidebarExpanded}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      />

      <main ref={mainRef} className="flex-1 overflow-auto">
        <div className="flex justify-center items-center min-h-screen p-6">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl items-stretch">
            <div
              ref={listRef}
              className="lg:w-[60%] bg-white rounded-2xl shadow-md p-6 flex flex-col h-full"
              style={{ minHeight: `${syncedHeight || 741}px` }}
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
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            <div
              ref={formRef}
              className="lg:w-[40%] bg-white rounded-2xl shadow-md p-6"
              style={{ minHeight: `${syncedHeight}px` }}
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
