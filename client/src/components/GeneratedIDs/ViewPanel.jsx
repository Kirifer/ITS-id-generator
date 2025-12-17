import React, { useState } from 'react';
import InfoField from '../Common/InfoFile';

export default function ViewPanel({ row, onEdit, onClose }) {
  const [side, setSide] = useState('front');

  // We assume the paths in 'row' are now full, absolute URLs that the browser can use directly.
  const path = side === 'back'
    ? (row.generatedBackImagePath || '')
    : (row.generatedFrontImagePath || row.photoPath);

  // Directly use the path as the source, without calling getAssetUrl(path)
  const src = path;
  const filenameBase = `${row.firstName || 'ID'}-${row.lastName || ''}-${row.idNumber || ''}`.replace(/\s+/g, '_');

  function printImage(url) {
    const w = window.open('', 'PRINT', 'height=700,width=900');
    if (!w) return;
    w.document.write(`<html><head><title>Print ${filenameBase}</title></head><body style="margin:0">
      <img src="${url}" style="width:100%;max-width:100%" onload="window.focus();window.print();window.close();" />
    </body></html>`);
    w.document.close();
  }

  const backAvailable = Boolean(row.generatedBackImagePath);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">View ID</h2>
          <p className="text-gray-600 text-sm">Preview and details.</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${side === 'front' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSide('front')}
          >Front</button>
          <button
            className={`px-3 py-1 rounded ${side === 'back' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSide('back')}
            disabled={!backAvailable}
            title={backAvailable ? 'Show back' : 'Back image not available'}
          >Back</button>
        </div>
      </div>

      <div className="border rounded-xl p-3 bg-gray-50">
        {src ? (
          <img src={src} alt="ID" className="w-full h-auto max-h-80 object-contain rounded-lg" />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            {side === 'back' ? 'No back image available' : 'No image available'}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        {src && (
          <>
            <a
              href={src}
              download={`${filenameBase}-${side}.png`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
              title="Download"
            >
              Download ({side})
            </a>
            <button
              onClick={() => printImage(src)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md"
              title="Print"
            >
              Print ({side})
            </button>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <InfoField label="Name" value={`${row.firstName} ${row.middleInitial ? row.middleInitial + '. ' : ''}${row.lastName}`} />
        <InfoField label="ID Number" value={row.idNumber} />
        <InfoField label="Position" value={row.position} />
        <InfoField label="Type" value={row.type} />
        <InfoField label="Status" value={row.status} />
        <InfoField label="Date Generated" value={row.date} />
        <InfoField label="Emergency Contact" value={`${row.emergencyFirstName} ${row.emergencyMiddleInitial ? row.emergencyMiddleInitial + '. ' : ''}${row.emergencyLastName}`} />
        <InfoField label="Emergency Phone" value={row.emergencyContactNumber} />
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onEdit} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md">
          Edit
        </button>
        <button onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-2 rounded-md">
          Close
        </button>
      </div>
    </div>
  );
}