// src/components/Viewing.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const ASSET_BASE = (API_BASE || "").replace(/\/api$/, "");

export default function GeneratedID() {
  const { idNumber } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const imgUrl = useMemo(() => {
    if (!data?.generatedImagePath) return "";
    return ASSET_BASE + data.generatedImagePath;
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/id-cards/by-id-number/${encodeURIComponent(idNumber)}`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.message || `Lookup failed (${res.status})`);
        }
        const j = await res.json();
        if (!cancelled) setData(j);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Unable to load ID");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [idNumber]);

  return (
    <div className="flex items-center justify-center min-h-screen custom-bg p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">View Generated ID</h1>
          <Link to="/view-login" className="text-sm text-purple-600 hover:underline">Back</Link>
        </div>

        <div className="mb-4 text-gray-600 text-sm">
          ID Number: <span className="font-semibold">{idNumber}</span>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : err ? (
          <div className="text-red-600">{err}</div>
        ) : (
          <>
            <div className="border rounded-xl p-3 bg-gray-50 mb-6">
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="Generated ID"
                  className="w-full h-auto object-contain max-h-[70vh] rounded-lg"
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                  No image available
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Info label="Name" value={formatName(data?.fullName)} />
              <Info label="Position" value={data?.position} />
              <Info label="Type" value={data?.type} />
              <Info label="ID Number" value={data?.idNumber || idNumber} />
            </div>

            {imgUrl && (
              <div className="mt-6 flex gap-3">
                <a
                  href={imgUrl}
                  download={`ID-${idNumber}.png`}
                  className="flex-1 text-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
                >
                  Download
                </a>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-2 rounded-md"
                >
                  Print
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-medium text-gray-800 break-words">{value || "—"}</div>
    </div>
  );
}

function formatName(n) {
  if (!n) return "";
  const mi = n.middleInitial ? `${n.middleInitial}. ` : "";
  return `${n.firstName || ""} ${mi}${n.lastName || ""}`.trim();
}
