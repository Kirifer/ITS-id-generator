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
import EditPanel from "../components/GeneratedIDs/EditPanel";
import FilterBar from "../components/GeneratedIDs/FilterBar";
import DeleteConfirmModal from "../components/Modal/DeleteConfirmModal";
import GenerateConfirmModal from "../components/Modal/GenerateConfirmModal";
import { showMessageBox } from "../utils/messageBox";
import { fmtDate } from "../utils/dateFormatter";
import {
  idCardStore,
  idCardDeleteStore,
  idCardUpdateStore,
} from "../store/cardStore";
import { generateIDStore } from "../store/generateStore";

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
  const {
    loading: generateLoading,
    success: generateSuccess,
    error: generateError,
    message: generateMessage,
    generateId,
    reset: generateReset,
  } = generateIDStore();

  const [tableHeight, setTableHeight] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [hrSignature, setHrSignature] = useState(null);
  const [panelMode, setPanelMode] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
  const [pendingGenerateRow, setPendingGenerateRow] = useState(null);

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
      getIdCards();
      setPanelMode("view");
      setPhoto(null);
      setHrSignature(null);
    }
    if (updateError && updateMessage) {
      showMessageBox(updateMessage);
      updateReset();
    }
  }, [updateSuccess, updateError, updateMessage, updateReset, getIdCards]);

  useEffect(() => {
    if (deleteSuccess) {
      showMessageBox(deleteMessage);
      deleteReset();
      idCardStore.setState((state) => ({
        items: state.items.filter((d) => d._id !== selectedId?._id),
      }));
      setSelectedId(null);
      setPanelMode(null);
      setDeleteModalOpen(false);
      setPendingDeleteRow(null);
    }
    if (deleteError && deleteMessage) {
      showMessageBox(deleteMessage);
      deleteReset();
      setDeleteModalOpen(false);
      setPendingDeleteRow(null);
    }
  }, [deleteSuccess, deleteError, deleteMessage, deleteReset, selectedId]);

  useEffect(() => {
    if (generateSuccess) {
      showMessageBox(generateMessage);
      generateReset();
      getIdCards();
      if (selectedId) {
        const updatedCard = items.find((item) => item._id === selectedId._id);
        if (updatedCard) {
          setSelectedId({
            ...selectedId,
            generatedFrontImagePath:
              updatedCard.generatedFrontImagePath ||
              updatedCard.generatedImagePath ||
              "",
            generatedBackImagePath: updatedCard.generatedBackImagePath || "",
          });
        }
      }
      setGenerateModalOpen(false);
      setPendingGenerateRow(null);
    }
    if (generateError && generateMessage) {
      showMessageBox(generateMessage);
      generateReset();
      setGenerateModalOpen(false);
      setPendingGenerateRow(null);
    }
  }, [
    generateSuccess,
    generateError,
    generateMessage,
    generateReset,
    getIdCards,
    items,
    selectedId,
  ]);

  const viewRows = useMemo(
    () =>
      items.map((doc) => ({
        _id: doc._id,
        firstName: doc?.fullName?.firstName || "",
        middleInitial: doc?.fullName?.middleInitial || "",
        lastName: doc?.fullName?.lastName || "",
        employeeNumber: doc?.employeeNumber || "",
        position: doc?.position || "",
        type: doc?.type || "",
        status: doc?.status || "",
        email: doc?.contactDetails?.email || "",
        phone: doc?.contactDetails?.phone || "",
        date: fmtDate(doc?.createdAt),
        emFirstName: doc?.emergencyContact?.firstName || "",
        emMiddleInitial: doc?.emergencyContact?.middleInitial || "",
        emLastName: doc?.emergencyContact?.lastName || "",
        emPhone: doc?.emergencyContact?.phone || "",
        hrName: doc?.hrDetails?.name || "",
        hrPosition: doc?.hrDetails?.position || "",
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
        String(id.employeeNumber).toLowerCase().includes(q) ||
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
    setHrSignature(null);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onEdit(row) {
    setSelectedId({ ...row });
    setPanelMode("edit");
    setPhoto(null);
    setHrSignature(null);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmitUpdate(e) {
    e.preventDefault();
    if (!selectedId?._id) return;

    const formData = new FormData();
    formData.append("firstName", selectedId.firstName);
    formData.append("middleInitial", selectedId.middleInitial);
    formData.append("lastName", selectedId.lastName);
    formData.append("position", selectedId.position);
    formData.append("type", selectedId.type);
    formData.append("email", selectedId.email);
    formData.append("phone", selectedId.phone);
    formData.append("emFirstName", selectedId.emFirstName);
    formData.append("emMiddleInitial", selectedId.emMiddleInitial);
    formData.append("emLastName", selectedId.emLastName);
    formData.append("emPhone", selectedId.emPhone);
    formData.append("hrName", selectedId.hrName);
    formData.append("hrPosition", selectedId.hrPosition);

    if (photo) {
      formData.append("photo", photo);
    }
    if (hrSignature) {
      formData.append("hrSignature", hrSignature);
    }

    try {
      await idCardUpdate(formData, selectedId._id);
    } catch (e) {}
  }

  function onDelete(row) {
    setPendingDeleteRow(row);
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteRow) return;
    try {
      await idCardDelete(pendingDeleteRow._id);
      idCardStore.setState((state) => ({
        items: state.items.filter((d) => d._id !== pendingDeleteRow._id),
      }));
      if (selectedId?._id === pendingDeleteRow._id) {
        setSelectedId(null);
        setPanelMode(null);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleCancelDelete() {
    setDeleteModalOpen(false);
    setPendingDeleteRow(null);
  }

  function onGenerate(row) {
    setPendingGenerateRow(row);
    setGenerateModalOpen(true);
  }

  async function handleConfirmGenerate() {
    if (!pendingGenerateRow) return;
    try {
      await generateId({ cardId: pendingGenerateRow._id });
    } catch (e) {
      console.error(e);
    }
  }

  function handleCancelGenerate() {
    setGenerateModalOpen(false);
    setPendingGenerateRow(null);
  }

  const sidebarExpanded = !selectedId || sidebarHover;
  const isActionLoading =
    loading || deleteLoading || updateLoading || generateLoading;

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
                canGenerate
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onGenerate={onGenerate}
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
                  hrSignature={hrSignature}
                  setHrSignature={setHrSignature}
                  onSubmit={onSubmitUpdate}
                  onCancel={() => {
                    setSelectedId(null);
                    setPanelMode(null);
                    setPhoto(null);
                    setHrSignature(null);
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
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        firstName={pendingDeleteRow?.firstName || ""}
        lastName={pendingDeleteRow?.lastName || ""}
        isLoading={deleteLoading}
      />
      <GenerateConfirmModal
        isOpen={generateModalOpen}
        onClose={handleCancelGenerate}
        onConfirm={handleConfirmGenerate}
        firstName={pendingGenerateRow?.firstName || ""}
        lastName={pendingGenerateRow?.lastName || ""}
        isLoading={generateLoading}
      />
    </div>
  );
}