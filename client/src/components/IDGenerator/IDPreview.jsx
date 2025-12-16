import React from 'react';

export default function IDPreview({ previewUrl, formHeight }) {
  return (
    <div
      className="bg-white/50 rounded-2xl shadow-lg p-6 sm:p-8 w-full flex items-center justify-center"
      style={{
        height: formHeight ? `${formHeight}px` : 'auto',
        transition: 'height 0.3s ease'
      }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Generated ID"
          className="max-w-full max-h-full object-contain rounded-xl"
        />
      ) : (
        <div className="text-gray-500 text-sm">Generated ID preview will appear here after submission.</div>
      )}
    </div>
  );
}

