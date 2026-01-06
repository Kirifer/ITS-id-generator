export default function FileUpload({
  id,
  icon: Icon,
  file,
  error,
  onFileChange,
  label,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>

      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center p-6 mb-3 border-2 border-dashed rounded-lg text-gray-500 cursor-pointer transition-colors duration-200 hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400"
        style={{ minHeight: "120px" }}
      >
        <Icon size={32} />

        <p className={`mt-2 text-sm text-center ${file ? "text-purple-600" : ""}`}>
          {file ? `Selected: ${file.name}` : "Click or drag a file to this area to upload."}
        </p>

        <p className="text-xs text-center">
          Supported formats: JPEG & PNG. Max file size: 4MB.
        </p>

        {error && (
          <p className="text-xs text-center text-red-500 mt-2">
            {error}
          </p>
        )}
      </label>

      <input
        type="file"
        id={id}
        className="hidden"
        accept=".jpeg,.jpg,.png"
        onChange={onFileChange}
      />
    </div>
  )
}
