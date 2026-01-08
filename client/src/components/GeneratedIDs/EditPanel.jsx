import React from "react";
import {
  User,
  CreditCard,
  Briefcase,
  Tag,
  Phone,
  Mail,
  UploadCloud,
  FileSignature,
} from "lucide-react";
import { removeBackground } from "@imgly/background-removal";
import InputWithIcon from "../Common/InputWithIcon";
import SelectWithIcon from "../Common/SelectWithIcon";
import FileUpload from "../Forms/FileUpload";

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
  const [signatureProcessing, setSignatureProcessing] = React.useState(false);

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

  const handleSignatureUpload = async (file) => {
    if (!validateFile(file, setHrSignatureError)) return;
    setSignatureProcessing(true);
    try {
      const result = await removeBackground(file);
      const blob = result instanceof Blob ? result : await result.blob();
      const processedFile = new File([blob], file.name, { type: "image/png" });
      setHrSignature(processedFile);
      setHrSignatureError("");
    } catch {
      setHrSignature(null);
      setHrSignatureError("Failed to remove background.");
    } finally {
      setSignatureProcessing(false);
    }
  };

  const isProcessing = photoProcessing || signatureProcessing;

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Details:</h2>
        <p className="text-gray-600 text-sm">
          Please provide the required information below.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Full Name
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                setSelectedId({ ...selectedId, middleInitial: e.target.value })
              }
              placeholder="Middle Initial"
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
            value={selectedId.employeeNumber}
            onChange={(e) =>
              setSelectedId({ ...selectedId, employeeNumber: e.target.value })
            }
            placeholder="Enter Employee Number"
            required
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectWithIcon
            Icon={Briefcase}
            value={selectedId.position}
            onChange={(e) =>
              setSelectedId({ ...selectedId, position: e.target.value })
            }
            label="Position"
            options={[
              "Full Stack Developer",
              "Human Resources",
              "Marketing",
              "Creative",
              "SEO",
            ]}
            required
            disabled={isProcessing}
          />
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
            onChange={(e) =>
              setSelectedId({ ...selectedId, phone: e.target.value })
            }
            placeholder="Enter Phone Number"
            type="tel"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Emergency Contact Person
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                setSelectedId({
                  ...selectedId,
                  emMiddleInitial: e.target.value,
                })
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
            onChange={(e) =>
              setSelectedId({ ...selectedId, emPhone: e.target.value })
            }
            placeholder="Enter Phone Number"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            HR Name
          </label>
          <InputWithIcon
            Icon={User}
            value={selectedId.hrName || ""}
            onChange={(e) =>
              setSelectedId({ ...selectedId, hrName: e.target.value })
            }
            placeholder="Enter HR Name"
            required
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            HR Position
          </label>
          <InputWithIcon
            Icon={Briefcase}
            value={selectedId.hrPosition || ""}
            onChange={(e) =>
              setSelectedId({ ...selectedId, hrPosition: e.target.value })
            }
            placeholder="Enter HR Position"
            required
            disabled={isProcessing}
          />
        </div>

        <FileUpload
          id="photoEditUpload"
          icon={UploadCloud}
          file={photo}
          error={photoError}
          onFileChange={(e) => handlePhotoUpload(e.target.files[0])}
          label="Photo"
          isProcessing={photoProcessing}
        />

        <FileUpload
          id="hrSignatureUpload"
          icon={FileSignature}
          file={hrSignature}
          error={hrSignatureError}
          onFileChange={(e) => handleSignatureUpload(e.target.files[0])}
          label="HR Signature"
          isProcessing={signatureProcessing}
        />

        <div className="mt-6 flex gap-4">
          <button
            onClick={onSubmit}
            disabled={isProcessing}
            className="flex-1 bg-purple-400 hover:bg-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Update
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
