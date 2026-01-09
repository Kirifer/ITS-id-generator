import {
  User,
  CreditCard,
  Briefcase,
  Tag,
  Phone,
  UploadCloud,
  FileSignature,
} from "lucide-react"
import { useEffect, useState } from "react"
import { removeBackground } from "@imgly/background-removal"
import InputField from "../Forms/InputField"
import SelectField from "../Forms/SelectField"
import FileUpload from "../Forms/FileUpload"

export default function IDGeneratorForm({
  formRef,
  formData,
  setFormData,
  photo,
  setPhoto,
  photoError,
  setPhotoError,
  hrSignature,
  setHrSignature,
  hrSignatureError,
  setHrSignatureError,
  onSubmit,
}) {
  const [photoProcessing, setPhotoProcessing] = useState(false)
  const [signatureProcessing, setSignatureProcessing] = useState(false)

  // 🔽 NEW STATES (TOGGLES)
  const [removePhotoBg, setRemovePhotoBg] = useState(true)
  const [removeSignatureBg, setRemoveSignatureBg] = useState(true)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (!formData.phone || formData.phone === "") {
      setFormData((prev) => ({ ...prev, phone: "+639" }))
    }
    if (!formData.emPhone || formData.emPhone === "") {
      setFormData((prev) => ({ ...prev, emPhone: "+639" }))
    }
  }, [])

  const handlePhoneChange = (field, value) => {
    if (!value.startsWith("+639")) value = "+639"
    const digits = value.slice(4).replace(/\D/g, "")
    const limitedDigits = digits.slice(0, 9)
    handleChange(field, "+639" + limitedDigits)
  }

  const getEmployeePrefix = () => {
    if (formData.type === "Intern") return "ITSIN-"
    if (formData.type === "Employee") return "ITS-"
    return ""
  }

  const handleEmployeeNumberChange = (value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 5)
    handleChange("employeeNumber", getEmployeePrefix() + numericValue)
  }

  const getDisplayNumber = () => {
    const prefix = getEmployeePrefix()
    if (formData.employeeNumber.startsWith(prefix)) {
      return formData.employeeNumber.slice(prefix.length)
    }
    return formData.employeeNumber.replace(/^(ITS-|ITSIN-)/, "")
  }

  useEffect(() => {
    if (formData.type && formData.employeeNumber) {
      const displayNum = getDisplayNumber()
      handleChange("employeeNumber", getEmployeePrefix() + displayNum)
    }
  }, [formData.type])

  const validateFile = (file, setFile, setError) => {
    if (!file) return false
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFile(null)
      setError("Invalid file type. Only JPEG and PNG are allowed.")
      return false
    }
    if (file.size > 4 * 1024 * 1024) {
      setFile(null)
      setError("File too large. Max 4MB.")
      return false
    }
    setError("")
    return true
  }

  const handlePhotoUpload = async (file) => {
    if (!validateFile(file, setPhoto, setPhotoError)) return

    // 🔽 TOGGLE LOGIC
    if (!removePhotoBg) {
      setPhoto(file)
      setPhotoError("")
      return
    }

    setPhotoProcessing(true)
    try {
      const image = await removeBackground(file)
      const blob = image instanceof Blob ? image : await image.blob()
      const processedFile = new File([blob], file.name, { type: "image/png" })
      setPhoto(processedFile)
      setPhotoError("")
    } catch {
      setPhoto(null)
      setPhotoError("Failed to remove background.")
    } finally {
      setPhotoProcessing(false)
    }
  }

  const handleSignatureUpload = async (file) => {
    if (!validateFile(file, setHrSignature, setHrSignatureError)) return

    // 🔽 TOGGLE LOGIC
    if (!removeSignatureBg) {
      setHrSignature(file)
      setHrSignatureError("")
      return
    }

    setSignatureProcessing(true)
    try {
      const image = await removeBackground(file)
      const blob = image instanceof Blob ? image : await image.blob()
      const processedFile = new File([blob], file.name, { type: "image/png" })
      setHrSignature(processedFile)
      setHrSignatureError("")
    } catch {
      setHrSignature(null)
      setHrSignatureError("Failed to remove background.")
    } finally {
      setSignatureProcessing(false)
    }
  }

  return (
    <div
      ref={formRef}
      className="bg-white rounded-2xl shadow-lg pt-4 sm:pt-6 px-2 sm:px-8 pb-6 sm:pb-7 w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800">Enter Details:</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Please provide the required information below.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
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
              required
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
          <SelectField
            icon={Briefcase}
            options={[
              "Full Stack Developer",
              "Human Resources",
              "Marketing",
              "Creative",
              "SEO",
            ]}
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
              required
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              HR Name
            </label>
            <InputField
              icon={User}
              placeholder="Enter HR Name"
              value={formData.hrName}
              onChange={(e) => handleChange("hrName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              HR Position
            </label>
            <InputField
              icon={Briefcase}
              placeholder="Enter HR Position"
              value={formData.hrPosition}
              onChange={(e) => handleChange("hrPosition", e.target.value)}
              required
            />
          </div>
        </div>

        {/* 🔽 PHOTO TOGGLE */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="removePhotoBg"
            checked={removePhotoBg}
            onChange={(e) => setRemovePhotoBg(e.target.checked)}
            className="accent-purple-500"
          />
          <label htmlFor="removePhotoBg" className="text-sm text-gray-700">
            Remove photo background
          </label>
        </div>

        <FileUpload
          id="photoUpload"
          icon={UploadCloud}
          file={photo}
          error={photoError}
          onFileChange={(e) => handlePhotoUpload(e.target.files[0])}
          label="Photo"
          isProcessing={photoProcessing}
        />

        {/* 🔽 SIGNATURE TOGGLE */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="removeSignatureBg"
            checked={removeSignatureBg}
            onChange={(e) => setRemoveSignatureBg(e.target.checked)}
            className="accent-purple-500"
          />
          <label htmlFor="removeSignatureBg" className="text-sm text-gray-700">
            Remove signature background
          </label>
        </div>

        <FileUpload
          id="hrSignatureUpload"
          icon={FileSignature}
          file={hrSignature}
          error={hrSignatureError}
          onFileChange={(e) => handleSignatureUpload(e.target.files[0])}
          label="HR Signature"
          isProcessing={signatureProcessing}
        />

        <button
          type="submit"
          disabled={photoProcessing || signatureProcessing}
          className="w-full bg-purple-400 hover:bg-purple-500 disabled:bg-purple-300 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
        >
          Generate
        </button>
      </form>
    </div>
  )
}
