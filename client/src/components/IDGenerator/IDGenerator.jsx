import {
  User,
  CreditCard,
  Briefcase,
  Tag,
  Phone,
  UploadCloud,
} from "lucide-react";
import { useEffect, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import InputField from "../Forms/InputField";
import SelectField from "../Forms/SelectField";
import FileUpload from "../Forms/FileUpload";
import ToggleSwitch from "../Forms/ToggleSwitch";
import HrSelector from "./HrSelector";
import PositionSelect from "../Forms/PositionSelect";

export default function IDGeneratorForm({
  formRef,
  formData,
  setFormData,
  photo,
  setPhoto,
  photoError,
  setPhotoError,
  onSubmit,
  hrSignature,
  setHrSignature,
  hrSignatureError,
  setHrSignatureError,
}) {
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [removePhotoBg, setRemovePhotoBg] = useState(false);

  const [hr_name, set_hr_name] = useState("");
  const [hr_position, set_hr_position] = useState("");
  const [hr_id, set_hr_id] = useState(null);
  const [hrResetKey, setHrResetKey] = useState(0);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      hrId: hr_id || "",
      hrName: hr_name,
      hrPosition: hr_position,
    }));
  }, [hr_id, hr_name, hr_position]);

  const resetHr = () => {
    set_hr_name("");
    set_hr_position("");
    set_hr_id(null);
    setHrSignature(null);
    setHrSignatureError("");
    setHrResetKey((prev) => prev + 1);
  };

  const isFormValid = () => {
    return (
      formData.firstName?.trim() &&
      formData.lastName?.trim() &&
      formData.type &&
      formData.employeeNumber?.length >= getEmployeePrefix().length + 5 &&
      formData.position &&
      formData.email?.trim() &&
      formData.phone?.length === 13 &&
      formData.emFirstName?.trim() &&
      formData.emLastName?.trim() &&
      formData.emPhone?.length === 13 &&
      hr_name?.trim() &&
      hr_position?.trim() &&
      (hr_id || hrSignature) &&
      photo &&
      !photoProcessing
    );
  };

  const handleSubmit = async (e) => {
    await onSubmit(e);
    resetHr();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!formData.phone || formData.phone === "") {
      setFormData((prev) => ({ ...prev, phone: "+639" }));
    }
    if (!formData.emPhone || formData.emPhone === "") {
      setFormData((prev) => ({ ...prev, emPhone: "+639" }));
    }
  }, []);

  const handlePhoneChange = (field, value) => {
    if (!value.startsWith("+639")) value = "+639";
    const digits = value.slice(4).replace(/\D/g, "");
    const limitedDigits = digits.slice(0, 9);
    handleChange(field, "+639" + limitedDigits);
  };

  const getEmployeePrefix = () => {
    if (formData.type === "Intern") return "ITSIN-";
    if (formData.type === "Employee") return "ITS-";
    return "";
  };

  const handleEmployeeNumberChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 5);
    handleChange("employeeNumber", getEmployeePrefix() + numericValue);
  };

  const getDisplayNumber = () => {
    const prefix = getEmployeePrefix();
    if (formData.employeeNumber.startsWith(prefix)) {
      return formData.employeeNumber.slice(prefix.length);
    }
    return formData.employeeNumber.replace(/^(ITS-|ITSIN-)/, "");
  };

  useEffect(() => {
    if (formData.type && formData.employeeNumber) {
      const displayNum = getDisplayNumber();
      handleChange("employeeNumber", getEmployeePrefix() + displayNum);
    }
  }, [formData.type]);

  const validateFile = (file, setFile, setError) => {
    if (!file) return false;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFile(null);
      setError("Invalid file type. Only JPEG and PNG are allowed.");
      return false;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFile(null);
      setError("File too large. Max 4MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handlePhotoUpload = async (file) => {
    if (!validateFile(file, setPhoto, setPhotoError)) return;

    if (!removePhotoBg) {
      setPhoto(file);
      setPhotoError("");
      return;
    }

    setPhotoProcessing(true);
    try {
      const image = await removeBackground(file);
      const blob = image instanceof Blob ? image : await image.blob();
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

  return (
    <div
      ref={formRef}
      className="bg-white rounded-2xl shadow-lg pt-4 sm:pt-6 px-2 sm:px-8 pb-6 sm:pb-7 w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800">Enter Details:</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Please provide the required information below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Full Name
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              icon={User}
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
            <InputField
              icon={User}
              placeholder="Middle Initial"
              maxLength={1}
              value={formData.middleInitial}
              onChange={(e) =>
                handleChange("middleInitial", e.target.value.toUpperCase())
              }
            />
            <InputField
              icon={User}
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Type
          </label>
          <SelectField
            icon={Tag}
            options={["Intern", "Employee"]}
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            placeholder="Select Type"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Employee Number{" "}
            {formData.type && (
              <span className="text-xs text-gray-500">
                ({formData.type === "Intern" ? "ITSIN-XXXXX" : "ITS-XXXXX"})
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={getEmployeePrefix()}
              className="w-32 pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-700 font-medium"
              disabled
              readOnly
            />
            <InputField
              icon={CreditCard}
              placeholder="Enter 5-digit Number"
              value={getDisplayNumber()}
              onChange={(e) => handleEmployeeNumberChange(e.target.value)}
              disabled={!formData.type}
              required
              minLength={5}
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Position
          </label>
          <PositionSelect
            icon={Briefcase}
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="Select Position"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Email
          </label>
          <InputField
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Phone
          </label>
          <InputField
            type="tel"
            placeholder="+639XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => handlePhoneChange("phone", e.target.value)}
            maxLength={13}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Emergency Contact Person
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              icon={User}
              placeholder="First Name"
              value={formData.emFirstName}
              onChange={(e) => handleChange("emFirstName", e.target.value)}
              required
            />
            <InputField
              icon={User}
              placeholder="Middle Initial"
              maxLength={1}
              value={formData.emMiddleInitial}
              onChange={(e) =>
                handleChange("emMiddleInitial", e.target.value.toUpperCase())
              }
            />
            <InputField
              icon={User}
              placeholder="Last Name"
              value={formData.emLastName}
              onChange={(e) => handleChange("emLastName", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Emergency Contact Number
          </label>
          <InputField
            icon={Phone}
            type="tel"
            placeholder="+639XXXXXXXXX"
            value={formData.emPhone}
            onChange={(e) => handlePhoneChange("emPhone", e.target.value)}
            maxLength={13}
            required
          />
        </div>

        <HrSelector
          key={hrResetKey}
          hr_name={hr_name}
          set_hr_name={set_hr_name}
          hr_position={hr_position}
          set_hr_position={set_hr_position}
          hr_signature={hrSignature}
          set_hr_signature={setHrSignature}
          set_hr_id={set_hr_id}
          hr_signature_error={hrSignatureError}
          set_hr_signature_error={setHrSignatureError}
        />

        <div className="border-t pt-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Photo Upload
          </label>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <ToggleSwitch
              id="removePhotoBg"
              label="Remove photo background"
              checked={removePhotoBg}
              onChange={setRemovePhotoBg}
            />
            <p className="text-xs text-gray-600 italic ml-14">
              Toggle this before uploading if you want automatic background
              removal
            </p>
            <FileUpload
              id="photoUpload"
              icon={UploadCloud}
              file={photo}
              error={photoError}
              onFileChange={(e) => handlePhotoUpload(e.target.files[0])}
              label="Photo"
              isProcessing={photoProcessing}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || photoProcessing}
          className="w-full bg-purple-400 hover:bg-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
