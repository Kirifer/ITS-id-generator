import React from 'react';

export default function InputWithIcon({ Icon, label, value, placeholder, required = false, onChange }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>}
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
      </div>
    </div>
  );
}