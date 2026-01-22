import React from "react";
import {
  User,
  CreditCard,
  Tag,
  Phone,
  Mail,
  UploadCloud,
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import InputWithIcon from "../Common/InputWithIcon";
import SelectWithIcon from "../Common/SelectWithIcon";
import FileUpload from "../Forms/FileUpload";
import ToggleSwitch from "../Forms/ToggleSwitch";
import HrSelector from "../IDGenerator/HrSelector";
import PositionSelect from "../Forms/PositionSelect";

const getEmployeePrefix = (type) =>
  type === "Intern" ? "ITSIN-" : "ITS-";

const formatEmployeeNumber = (type, value) => {
  const prefix = getEmployeePrefix(type);
  let digits = value.replace(prefix, "").replace(/\D/g, "");
  digits = digits.slice(0, 5);
  return prefix + digits;
};

export default function EditPanel({
  selectedId,
  setSelectedId,
  photo,
  setPhoto,
  hrSignature,
  setHrSignature,
  onSubmit,
  onCancel,
}) {
  const [photoError, setPhotoError] = React.useState("");
  const [hrSignatureError, setHrSignatureError] = React.useState("");
  const [photoProcessing, setPhotoProcessing] = React.useState(false);
  const [removePhotoBg, setRemovePhotoBg] = React.useState(false);

  const [hrName, setHrName] = React.useState(selectedId.hrName || "");
  const [hrPosition, setHrPosition] = React.useState(
    selectedId.hrPosition || ""
  );
  const [hrId, setHrId] = React.useState(selectedId.hrId || null);

  React.useEffect(() => {
    setSelectedId((prev) => ({
      ...prev,
      hrId: hrId || "",
      hrName,
      hrPosition,
    }));
  }, [hrId, hrName, hrPosition]);

  React.useEffect(() => {
    if (!selectedId.type) return;
    setSelectedId((prev) => ({
      ...prev,
      employeeNumber: formatEmployeeNumber(
        prev.type,
        prev.employeeNumber || ""
      ),
    }));
  }, [selectedId.type]);

  const handlePhoneChange = (field, value) => {
    let digits = value.replace(/\D/g, "");
    if (!digits.startsWith("09")) digits = "09";
    digits = digits.slice(0, 11);
    setSelectedId((prev) => ({
      ...prev,
      [field]: digits,
    }));
  };

  const validateFile = (file, setError) => {
    if (!file) return false;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Invalid file type. Only JPEG and PNG are allowed.");
      return false;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("File too large. Max 4MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePhotoUpload = async (file) => {
    if (!validateFile(file, setPhotoError)) return;
    if (!removePhotoBg) {
      setPhoto(file);
      setPhotoError("");
      return;
    }
    setPhotoProcessing(true);
    try {
      const result = await removeBackground(file);
      const blob = result instanceof Blob ? result : await result.blob();
      const processedFile = new File([blob], file.name, { type: "image/png" });
      setPhoto(processedFile);
      setPhotoError("");
    } catch {
      setPhoto(null);
      setPhotoError("Failed to remove background.");
    } finally {
      setPhotoProcessing(false);
    }
  };

  const handleMiddleInitialChange = (field, value) => {
    if (value === "") {
      setSelectedId((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    const letters = value.replace(/[^a-zA-Z]/g, "");
    if (letters.length === 0) {
      setSelectedId((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    const letter = letters.charAt(0).toUpperCase();
    setSelectedId((prev) => ({
      ...prev,
      [field]: letter + ".",
    }));
  };

  const isProcessing = photoProcessing;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Details:</h2>
        <p className="text-gray-600 text-sm">
          Please provide the required information below.
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Full Name
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputWithIcon
              Icon={User}
              value={selectedId.firstName}
              onChange={(e) =>
                setSelectedId({ ...selectedId, firstName: e.target.value })
              }
              placeholder="First Name"
              required
              disabled={isProcessing}
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.middleInitial}
              onChange={(e) =>
                handleMiddleInitialChange("middleInitial", e.target.value)
              }
              placeholder="Middle Initial"
              maxLength={2}
              required
              disabled={isProcessing}
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.lastName}
              onChange={(e) =>
                setSelectedId({ ...selectedId, lastName: e.target.value })
              }
              placeholder="Last Name"
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Employee Number
          </label>
          <InputWithIcon
            Icon={CreditCard}
            value={
              selectedId.employeeNumber ||
              getEmployeePrefix(selectedId.type)
            }
            onChange={(e) =>
              setSelectedId((prev) => ({
                ...prev,
                employeeNumber: formatEmployeeNumber(
                  prev.type,
                  e.target.value
                ),
              }))
            }
            placeholder={
              selectedId.type === "Intern"
                ? "ITSIN-12345"
                : "ITS-12345"
            }
            required
            disabled={isProcessing || !selectedId.type}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Position
            </label>
            <PositionSelect
              value={selectedId.position}
              onChange={(e) =>
                setSelectedId({ ...selectedId, position: e.target.value })
              }
              required
              disabled={isProcessing}
            />
          </div>

          <SelectWithIcon
            Icon={Tag}
            value={selectedId.type}
            onChange={(e) =>
              setSelectedId({ ...selectedId, type: e.target.value })
            }
            label="Type"
            options={["Intern", "Employee"]}
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Email
          </label>
          <InputWithIcon
            Icon={Mail}
            value={selectedId.email || ""}
            onChange={(e) =>
              setSelectedId({ ...selectedId, email: e.target.value })
            }
            placeholder="Enter Email"
            type="email"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Phone Number
          </label>
          <InputWithIcon
            Icon={Phone}
            value={selectedId.phone || ""}
            onChange={(e) => handlePhoneChange("phone", e.target.value)}
            placeholder="09XXXXXXXXX"
            type="tel"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Emergency Contact Person
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputWithIcon
              Icon={User}
              value={selectedId.emFirstName || ""}
              onChange={(e) =>
                setSelectedId({ ...selectedId, emFirstName: e.target.value })
              }
              placeholder="First Name"
              required
              disabled={isProcessing}
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.emMiddleInitial || ""}
              onChange={(e) =>
                handleMiddleInitialChange("emMiddleInitial", e.target.value)
              }
              placeholder="Middle Initial"
              required
              disabled={isProcessing}
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.emLastName || ""}
              onChange={(e) =>
                setSelectedId({ ...selectedId, emLastName: e.target.value })
              }
              placeholder="Last Name"
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Emergency Contact Number
          </label>
          <InputWithIcon
            Icon={Phone}
            value={selectedId.emPhone || ""}
            onChange={(e) => handlePhoneChange("emPhone", e.target.value)}
            placeholder="09XXXXXXXXX"
            required
            disabled={isProcessing}
          />
        </div>

        <HrSelector
          hr_name={hrName}
          set_hr_name={setHrName}
          hr_position={hrPosition}
          set_hr_position={setHrPosition}
          hr_signature={hrSignature}
          set_hr_signature={setHrSignature}
          set_hr_id={setHrId}
          hr_signature_error={hrSignatureError}
          set_hr_signature_error={setHrSignatureError}
        />

        <div className="border-t pt-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Photo Upload
          </label>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <ToggleSwitch
              id="removePhotoBgEdit"
              label="Remove photo background"
              checked={removePhotoBg}
              onChange={setRemovePhotoBg}
            />
            <p className="text-xs text-gray-600 italic ml-14">
              Toggle this before uploading if you want automatic background
              removal
            </p>
            <FileUpload
              id="photoEditUpload"
              icon={UploadCloud}
              file={photo}
              error={photoError}
              onFileChange={(e) => handlePhotoUpload(e.target.files[0])}
              label="Photo"
              isProcessing={photoProcessing}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className="flex-1 bg-purple-400 hover:bg-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 rounded-md transition duration-200 text-sm sm:text-base"
        >
          Update
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 rounded-md transition duration-200 text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}