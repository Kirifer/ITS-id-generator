import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { idCardDetailStore } from "../store/cardStore";
import { getImageUrl } from "../utils/imageUrl";
import { saveAs } from "file-saver";

export default function GeneratedID() {
  const { idNumber } = useParams();
  const { data, loading, error, message, getIdCardDetail } = idCardDetailStore();
  const [side, setSide] = useState("front");

  useEffect(() => {
    if (idNumber) {
      getIdCardDetail(idNumber);
    }
  }, [idNumber, getIdCardDetail]);

  const imgUrl = useMemo(() => {
    if (!data) return "";
    const path =
      side === "back"
        ? data.generatedBackImagePath
        : data.generatedFrontImagePath;
    return path ? getImageUrl(path) : "";
  }, [data, side]);

  const handleDownload = () => {
    if (!imgUrl) return;
    saveAs(imgUrl, `ID-${idNumber}-${side}.png`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen custom-bg p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">View Generated ID</h1>
          <Link to="/view-login" className="text-sm text-purple-600 hover:underline">
            Back
          </Link>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : error ? (
          <div className="text-red-600">{message}</div>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSide("front")}
                className={`px-3 py-1 rounded ${
                  side === "front" ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setSide("back")}
                className={`px-3 py-1 rounded ${
                  side === "back" ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                Back
              </button>
            </div>

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
              <Info label="ID Number" value={data?.employeeNumber || idNumber} />
            </div>

            {imgUrl && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 text-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md"
                >
                  Download
                </button>
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
      <div className="font-medium text-gray-800 break-words">
        {value || "—"}
      </div>
    </div>
  );
}

function formatName(n) {
  if (!n) return "";
  const mi = n.middleInitial ? `${n.middleInitial}. ` : "";
  return `${n.firstName || ""} ${mi}${n.lastName || ""}`.trim();
}
