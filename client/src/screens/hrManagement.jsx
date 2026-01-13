import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import Sidebar from "../components/Sidebar";
import { hrStore } from "../store/hrStore";
import InputField from "../components/Forms/InputField";
import FileUpload from "../components/Forms/FileUpload";
import ToggleSwitch from "../components/Forms/ToggleSwitch"; // ✅ TOGGLE IMPORT
import { getImageUrl } from "../utils/imageUrl";

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
  const [removeSignatureBg, setRemoveSignatureBg] = useState(true); // ✅ TOGGLE STATE

  useEffect(() => {
    getHrList();
  }, [getHrList]);

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

  /* ---------- FILE VALIDATION ---------- */
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

  /* ---------- SIGNATURE UPLOAD + OPTIONAL BG REMOVAL ---------- */
  const handleSignatureUpload = async (file) => {
    if (!validateFile(file)) {
      setSignature(null);
      return;
    }

    // ⛔ Background removal OFF
    if (!removeSignatureBg) {
      setSignature(file);
      return;
    }

    // ✅ Background removal ON
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

  const handleDelete = async (hr) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${hr.name}?`
    );
    if (!confirmed) return;

    await deleteHr(hr._id);
    reset();
  };

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={!showForm} />

      <main className="flex-1 overflow-hidden custom-bg">
        <div className="h-full flex transition-all duration-300 ease-in-out">

          {/* LEFT SIDE */}
          <div
            className={`transition-all duration-300 overflow-auto
              ${showForm ? "w-2/3" : "w-full"}`}
          >
            <div className="p-6">
              <div className="flex flex-col gap-6 max-w-screen-xl mx-auto">

                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      HR Management
                    </h1>
                    <p className="text-sm text-gray-600">
                      Manage HR signatories and positions
                    </p>
                  </div>

                  <button
                    onClick={openCreateForm}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    <Plus size={18} /> Add HR
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-4 px-4">Name</th>
                        <th className="text-left py-4 px-4">Position</th>
                        <th className="text-left py-4 px-4">Signature</th>
                        <th className="text-center py-4 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hrList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-10 text-center text-gray-500">
                            No HR records found
                          </td>
                        </tr>
                      ) : (
                        hrList.map((hr) => (
                          <tr key={hr._id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">{hr.name}</td>
                            <td className="py-4 px-4">{hr.position}</td>
                            <td className="py-4 px-4">
                              <img
                                src={getImageUrl(hr.signaturePath)}
                                className="h-10 object-contain"
                                alt="signature"
                              />
                            </td>
                            <td className="py-4 px-4 flex justify-center gap-3">
                              <button
                                onClick={() => openEditForm(hr)}
                                className="text-purple-500"
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(hr)}
                                className="text-purple-500"
                              >
                                <Trash2 size={18} />
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

          {/* RIGHT FORM */}
          <div
            className={`bg-white shadow-xl transition-all duration-300
              ${showForm ? "w-1/3" : "w-0"} overflow-hidden`}
          >
            {showForm && (
              <div className="h-full p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {isEditing ? "Edit HR" : "Create HR"}
                  </h2>
                  <button onClick={closeForm}>
                    <X />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {/* ✅ TOGGLE (NO DESIGN CHANGE) */}
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

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || signatureProcessing}
                      className="flex-1 bg-purple-500 text-white py-2 rounded-lg"
                    >
                      {isEditing ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 border py-2 rounded-lg"
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
    </div>
  );
}
