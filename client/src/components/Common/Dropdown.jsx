import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="relative w-fit">
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
        className="appearance-none border border-gray-300 rounded-lg px-3 pr-8 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        {options.map((option, i) => (<option key={i}>{option}</option>))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">
        <FaChevronDown size={14} />
      </div>
    </div>
  );
}
