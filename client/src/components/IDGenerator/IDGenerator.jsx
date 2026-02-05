import {
  User,
  CreditCard,
  Briefcase,
  Tag,
  Phone,
  UploadCloud,
  Loader2,
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
  errors,
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
  const [photoReady, setPhotoReady] = useState(false);
  const [removePhotoBg, setRemovePhotoBg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (!formData.type) return;

    const domain = getEmailDomain();
    const localPart = formData.email?.split("@")[0] || "";

    if (domain) {
      setFormData((prev) => ({
        ...prev,
        email: localPart + domain,
      }));
    }
  }, [formData.type]);

  const sanitizeName = (value) => value.replace(/[^a-zA-Z\s]/g, "");

  const resetHr = () => {
    set_hr_name("");
    set_hr_position("");
    set_hr_id(null);
    setHrSignature(null);
    setHrSignatureError("");
    setHrResetKey((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ run form validation FIRST
    const isValid = await onSubmit(e);
    if (!isValid) {
      return;
    }

    // 2️⃣ validate photo AFTER form fields
    if (!photo) {
      setPhotoError("Photo is required");
      return;
    } else {
      setPhotoError("");
    }

    setIsSubmitting(true);
    try {
      resetHr();
    } finally {
      setIsSubmitting(false);
    }
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

  const getEmailDomain = () => {
    if (formData.type === "Intern") return "@outlook.com";
    if (formData.type === "Employee") return "@itsquarehub.com";
    return "";
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
    setPhotoReady(false); // ✅ reset on every new upload

    if (!validateFile(file, setPhoto, setPhotoError)) return;

    // ✅ NO background removal
    if (!removePhotoBg) {
      setPhoto(file);
      setPhotoReady(true); // ✅ READY immediately
      setPhotoError("");
      return;
    }

    // ✅ WITH background removal
    setPhotoProcessing(true);
    try {
      const image = await removeBackground(file);
      const blob = image instanceof Blob ? image : await image.blob();

      const processedFile = new File(
        [blob],
        file.name.replace(/\.(jpg|jpeg)$/i, ".png"),
        { type: "image/png" },
      );

      if (!processedFile.size) {
        throw new Error("Processed image empty");
      }

      setPhoto(processedFile);
      setPhotoReady(true); // ✅ READY only after processing
      setPhotoError("");
    } catch {
      setPhoto(null);
      setPhotoReady(false);
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Full Name
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              icon={User}
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                handleChange("firstName", sanitizeName(e.target.value))
              }
              error={errors?.firstName} // ✅ ADD
              required
            />

            <InputField
              icon={User}
              placeholder="Middle Initial"
              maxLength={1}
              value={formData.middleInitial}
              onChange={(e) => {
                const letter = sanitizeName(e.target.value)
                  .charAt(0)
                  .toUpperCase();
                handleChange("middleInitial", letter);
              }}
              error={errors?.middleInitial}
              required
            />

            <InputField
              icon={User}
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                handleChange("lastName", sanitizeName(e.target.value))
              }
              error={errors?.lastName} // ✅ ADD
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
            error={errors?.type} // 🔴 ADD THIS
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
              error={errors?.employeeNumber} // ✅ ADD
              required
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
            error={errors?.position} // ✅ ADD
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Email
          </label>

          <div className="flex">
            <input
              type="text"
              placeholder="username"
              value={formData.email?.split("@")[0] || ""}
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value.replace(/[^a-zA-Z0-9._-]/g, "") +
                    getEmailDomain(),
                )
              }
              className={`flex-1 pl-3 pr-3 py-2 rounded-l-lg text-sm ${
                errors?.email
                  ? "border border-red-500"
                  : "border border-gray-300"
              }`}
              disabled={!formData.type}
              required
            />

            <span
              className={`px-3 py-2 border border-l-0 rounded-r-lg bg-gray-100 text-sm ${
                errors?.email
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              {getEmailDomain()}
            </span>
          </div>
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
            minLength={13}
            error={errors?.phone} // ✅ ADD
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
              onChange={(e) =>
                handleChange("emFirstName", sanitizeName(e.target.value))
              }
              error={errors?.emFirstName} // 🔴 ADD THIS
              required
            />

            <InputField
              icon={User}
              placeholder="Middle Initial"
              maxLength={1}
              value={formData.emMiddleInitial}
              onChange={(e) => {
                const letter = sanitizeName(e.target.value)
                  .charAt(0)
                  .toUpperCase();
                handleChange("emMiddleInitial", letter);
              }}
              error={errors?.emMiddleInitial}
              required
            />

            <InputField
              icon={User}
              placeholder="Last Name"
              value={formData.emLastName}
              onChange={(e) =>
                handleChange("emLastName", sanitizeName(e.target.value))
              }
              error={errors?.emLastName}
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
            minLength={13}
            error={errors?.emPhone}
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
          setFormData={setFormData}
          errors={errors}
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
          disabled={photoProcessing || isSubmitting}
          className="w-full bg-purple-400 hover:bg-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition duration-200 text-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </button>
      </form>
    </div>
  );
}
