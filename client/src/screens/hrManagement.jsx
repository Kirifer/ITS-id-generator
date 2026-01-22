import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import Sidebar from "../components/Sidebar";
import { hrStore } from "../store/hrStore";
import InputField from "../components/Forms/InputField";
import FileUpload from "../components/Forms/FileUpload";
import ToggleSwitch from "../components/Forms/ToggleSwitch";
import { getImageUrl } from "../utils/imageUrl";
import HrDeleteConfirmModal from "../components/Modal/HrDeleteConfirmModal";

export default function HRManagement() {
  const {
    loading,
    hrList,
    selectedHr,
    setSelectedHr,
    getHrList,
    createHr,
    updateHr,
    deleteHr,
    reset,
  } = hrStore();

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
  });

  const [signature, setSignature] = useState(null);
  const [signatureError, setSignatureError] = useState("");
  const [signatureProcessing, setSignatureProcessing] = useState(false);
  const [removeSignatureBg, setRemoveSignatureBg] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hrToDelete, setHrToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getHrList();
  }, [getHrList]);

  const filteredHrList = hrList.filter((hr) => {
    const term = searchTerm.toLowerCase();
    return (
      hr.name.toLowerCase().includes(term) ||
      hr.position.toLowerCase().includes(term)
    );
  });

  const openCreateForm = () => {
    reset();
    setSelectedHr(null);
    setFormData({ name: "", position: "" });
    setSignature(null);
    setSignatureError("");
    setIsEditing(false);
    setShowForm(true);
  };

  const openEditForm = (hr) => {
    reset();
    setSelectedHr(hr);
    setFormData({
      name: hr.name,
      position: hr.position,
    });
    setSignature(null);
    setSignatureError("");
    setIsEditing(true);
    setShowForm(true);
  };

  const validateFile = (file) => {
    if (!file) return false;
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setSignatureError("Only PNG and JPG files are allowed");
      return false;
    }
    if (file.size > 4 * 1024 * 1024) {
      setSignatureError("File too large (max 4MB)");
      return false;
    }
    setSignatureError("");
    return true;
  };

  const handleSignatureUpload = async (file) => {
    if (!validateFile(file)) {
      setSignature(null);
      return;
    }

    if (!removeSignatureBg) {
      setSignature(file);
      return;
    }

    setSignatureProcessing(true);
    try {
      const image = await removeBackground(file);
      const blob = image instanceof Blob ? image : await image.blob();
      const processedFile = new File([blob], file.name, {
        type: "image/png",
      });
      setSignature(processedFile);
    } catch {
      setSignature(null);
      setSignatureError("Failed to remove background");
    } finally {
      setSignatureProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !signature) {
      setSignatureError("Signature is required");
      return;
    }

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("position", formData.position);
    if (signature) fd.append("signature", signature);

    if (isEditing && selectedHr?._id) {
      await updateHr(selectedHr._id, fd);
    } else {
      await createHr(fd);
    }

    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    reset();
  };

  const handleDelete = (hr) => {
    setHrToDelete(hr);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!hrToDelete) return;
    await deleteHr(hrToDelete._id);
    setShowDeleteConfirm(false);
    setHrToDelete(null);
    reset();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setHrToDelete(null);
  };

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={!showForm} />

      <main className="flex-1 overflow-hidden custom-bg lg:ml-0 ml-0">
        <div className="h-full flex transition-all duration-300 ease-in-out">
          <div
            className={`transition-all duration-300 overflow-auto ${
              showForm ? "lg:w-2/3 lg:pr-6 w-full" : "w-full"
            }`}
          >
               <div className="p-2 sm:px-6 pt-20 lg:pt-10">
              <div className="flex flex-col gap-6 max-w-screen-xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      HR Management
                    </h1>
                    <p className="text-sm text-gray-600">
                      Manage HR signatories and positions
                    </p>
                  </div>

                  <button
                    onClick={openCreateForm}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
                  >
                    <Plus size={18} /> Add HR
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col max-h-[calc(100vh-180px)] sm:max-h-[calc(100vh-220px)]">
                  <div className="mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="overflow-auto flex-1 border border-gray-200 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white z-10 border-b">
                        <tr>
                          <th className="text-left py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Name</th>
                          <th className="text-left py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Position</th>
                          <th className="text-left py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Signature</th>
                          <th className="text-center py-3 sm:py-4 px-2 sm:px-4 whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHrList.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="py-10 text-center text-gray-500 text-xs sm:text-sm"
                            >
                              No matching HR records found
                            </td>
                          </tr>
                        ) : (
                          filteredHrList.map((hr) => (
                            <tr
                              key={hr._id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">{hr.name}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">{hr.position}</td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4">
                                <img
                                  src={getImageUrl(hr.signaturePath)}
                                  className="h-8 sm:h-10 object-contain"
                                  alt="signature"
                                />
                              </td>
                              <td className="py-3 sm:py-4 px-2 sm:px-4 flex justify-center gap-2 sm:gap-3">
                                <button
                                  onClick={() => openEditForm(hr)}
                                  className="text-purple-500"
                                >
                                  <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                                <button
                                  onClick={() => handleDelete(hr)}
                                  className="text-purple-500"
                                >
                                  <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <>
              <div 
                onClick={closeForm}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-30" 
              />
              <div className="hidden lg:block fixed inset-0 bg-black bg-opacity-40 z-30" />
            </>
          )}

          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-all duration-300 z-40 ${
              showForm ? "lg:w-1/3 w-full sm:w-3/4" : "w-0"
            } overflow-hidden`}
          >
            {showForm && (
              <div className="h-full p-4 sm:p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {isEditing ? "Edit HR" : "Create HR"}
                  </h2>
                  <button onClick={closeForm} className="p-1">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1">
                  <InputField
                    placeholder="HR Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <InputField
                    placeholder="HR Position"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />

                  <ToggleSwitch
                    id="removeSignatureBg"
                    label="Remove signature background"
                    checked={removeSignatureBg}
                    onChange={setRemoveSignatureBg}
                  />

                  <FileUpload
                    id="signatureUpload"
                    label="Signature"
                    file={signature}
                    error={signatureError}
                    onFileChange={(e) =>
                      handleSignatureUpload(e.target.files[0])
                    }
                    isProcessing={signatureProcessing}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || signatureProcessing}
                      className="flex-1 bg-purple-500 text-white py-2 rounded-lg disabled:bg-purple-300 text-sm sm:text-base"
                    >
                      {isEditing ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 border py-2 rounded-lg text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <HrDeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        hrName={hrToDelete?.name}
        isLoading={loading}
      />
    </div>
  );
}