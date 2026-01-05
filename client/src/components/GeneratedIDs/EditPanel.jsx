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

  const handleFileUpload = (file, setFile, setError) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFile(null);
      setError("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFile(null);
      setError("File too large. Max 4MB.");
      return;
    }
    setFile(file);
    setError("");
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Details:</h2>
        <p className="text-gray-600 text-sm">
          Please provide the required information below.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
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
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.middleInitial}
              onChange={(e) =>
                setSelectedId({ ...selectedId, middleInitial: e.target.value })
              }
              placeholder="Middle Initial"
              required
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.lastName}
              onChange={(e) =>
                setSelectedId({ ...selectedId, lastName: e.target.value })
              }
              placeholder="Last Name"
              required
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
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.emLastName || ""}
              onChange={(e) =>
                setSelectedId({ ...selectedId, emLastName: e.target.value })
              }
              placeholder="Last Name"
              required
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
          />
        </div>

        <FileUpload
          id="photoEditUpload"
          icon={UploadCloud}
          file={photo}
          error={photoError}
          onFileChange={(e) =>
            handleFileUpload(e.target.files[0], setPhoto, setPhotoError)
          }
          label="Photo"
        />

        <FileUpload
          id="hrSignatureUpload"
          icon={FileSignature}
          file={hrSignature}
          error={hrSignatureError}
          onFileChange={(e) =>
            handleFileUpload(
              e.target.files[0],
              setHrSignature,
              setHrSignatureError
            )
          }
          label="HR Signature"
        />

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
