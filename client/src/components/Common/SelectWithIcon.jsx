import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectWithIcon({ Icon, label, value, options, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <select
          className="appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white"
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((option, i) => (<option key={i} value={option}>{option}</option>))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
      </div>
    </div>
  );
}

