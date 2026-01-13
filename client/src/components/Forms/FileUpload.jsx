export default function FileUpload({
  id,
  icon: Icon,
  file,
  error,
  onFileChange,
  label,
  isProcessing = false,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>

      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center p-6 mb-3 border-2 border-dashed rounded-lg transition-colors duration-200 ${
          isProcessing
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "text-gray-500 cursor-pointer hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400"
        }`}
        style={{ minHeight: "120px" }}
      >
        {/* ✅ SAFE ICON RENDER */}
        {Icon && <Icon size={32} />}

        <p className={`mt-2 text-sm text-center ${file ? "text-purple-600" : ""}`}>
          {isProcessing
            ? "Processing..."
            : file
            ? `Selected: ${file.name}`
            : "Click or drag a file to this area to upload."}
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
        disabled={isProcessing}
      />
    </div>
  );
}
