import { ChevronDown } from "lucide-react";

export default function SelectField({ 
  icon: Icon, 
  options, 
  value, 
  onChange, 
  placeholder, 
  required = false 
}) {
  return (
    <div className="relative">
      <Icon 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        size={16} 
      />
      <select
        className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown 
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" 
        size={14} 
      />
    </div>
  );
}