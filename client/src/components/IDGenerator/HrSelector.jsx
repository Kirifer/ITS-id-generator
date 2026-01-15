import { useEffect, useState } from "react"
import { UploadCloud, User, Briefcase } from "lucide-react"
import { removeBackground } from "@imgly/background-removal"
import { hrStore } from "../../store/hrStore"
import InputField from "../Forms/InputField"
import SelectField from "../Forms/SelectField"
import FileUpload from "../Forms/FileUpload"
import ToggleSwitch from "../Forms/ToggleSwitch"

export default function HrSelector({
  hr_name,
  set_hr_name,
  hr_position,
  set_hr_position,
  hr_signature,
  set_hr_signature,
  set_hr_id,
  hr_signature_error,
  set_hr_signature_error,
}) {
  const { hrList, getHrList } = hrStore()

  const [use_dropdown, set_use_dropdown] = useState(true)
  const [remove_signature_bg, set_remove_signature_bg] = useState(false)
  const [signature_processing, set_signature_processing] = useState(false)

  useEffect(() => {
    getHrList()
  }, [])

  const validate_file = (file) => {
    if (!file) return false

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      set_hr_signature(null)
      set_hr_signature_error("Invalid file type")
      return false
    }

    if (file.size > 2 * 1024 * 1024) {
      set_hr_signature(null)
      set_hr_signature_error("Max 2MB")
      return false
    }

    set_hr_signature_error("")
    return true
  }

  const handle_signature_upload = async (file) => {
    if (!validate_file(file)) return

    if (!remove_signature_bg) {
      set_hr_signature(file)
      return
    }

    set_signature_processing(true)
    try {
      const image = await removeBackground(file)
      const blob = image instanceof Blob ? image : await image.blob()
      const processed = new File([blob], file.name, { type: "image/png" })
      set_hr_signature(processed)
    } catch {
      set_hr_signature(null)
      set_hr_signature_error("Background removal failed")
    } finally {
      set_signature_processing(false)
    }
  }

  const hr_options = hrList.map((hr) => hr.name)

  const handle_hr_select = (value) => {
    const selected_hr = hrList.find((hr) => hr.name === value)
    if (!selected_hr) return

    set_hr_name(selected_hr.name)
    set_hr_position(selected_hr.position)
    set_hr_signature(null)
    set_hr_id(selected_hr._id)
    set_hr_signature_error("")
  }

  return (
    <div className="border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-gray-800">HR Details</h3>

      <ToggleSwitch
        id="use_hr_dropdown"
        label="Select HR from list"
        checked={use_dropdown}
        onChange={(val) => {
          set_use_dropdown(val)
          if (!val) {
            set_hr_id(null)
            set_hr_signature(null)
          }
        }}
      />

      {use_dropdown ? (
        <SelectField
          icon={User}
          options={hr_options}
          value={hr_name}
          onChange={(e) => handle_hr_select(e.target.value)}
          placeholder="Select HR"
          required
        />
      ) : (
        <InputField
          icon={User}
          placeholder="HR Name"
          value={hr_name}
          onChange={(e) => set_hr_name(e.target.value)}
          required
        />
      )}

      <InputField
        icon={Briefcase}
        placeholder="HR Position"
        value={hr_position}
        onChange={(e) => set_hr_position(e.target.value)}
        required
        disabled={use_dropdown}
      />

      {!use_dropdown && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <ToggleSwitch
            id="remove_signature_bg"
            label="Remove signature background"
            checked={remove_signature_bg}
            onChange={set_remove_signature_bg}
          />

          <FileUpload
            id="hr_signature"
            icon={UploadCloud}
            file={hr_signature}
            error={hr_signature_error}
            onFileChange={(e) => handle_signature_upload(e.target.files[0])}
            label="HR Signature"
            isProcessing={signature_processing}
          />
        </div>
      )}
    </div>
  )
}
