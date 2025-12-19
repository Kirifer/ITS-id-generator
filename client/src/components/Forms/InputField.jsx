export default function InputField({ 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  ...props 
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
          size={16} 
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
}