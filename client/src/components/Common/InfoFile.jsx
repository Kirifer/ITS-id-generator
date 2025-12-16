import React from 'react';

export default function InfoField({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-medium text-gray-800 break-words">{value || '—'}</div>
    </div>
  );
}
