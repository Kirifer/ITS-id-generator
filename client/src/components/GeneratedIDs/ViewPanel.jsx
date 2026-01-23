import React, { useState, useEffect } from "react";
import InfoField from "../Common/InfoFile";
import { getImageUrl } from "../../utils/imageUrl";
import { downloadImage } from "../../utils/downloadUtils";

export default function ViewPanel({ row, onEdit, onClose }) {
  const [side, setSide] = useState("front");
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const relativePath =
    side === "back"
      ? row.generatedBackImagePath || ""
      : row.generatedFrontImagePath || row.photoPath;

  useEffect(() => {
    const loadImage = async () => {
      if (!relativePath) {
        setSrc("");
        setLoading(false);
        return;
      }

      setLoading(true);
      const url = await getImageUrl(relativePath);
      setSrc(url);
      setLoading(false);
    };

    loadImage();
  }, [relativePath]);

  const filenameBase = `${row.firstName || "ID"}-${row.lastName || ""}-${
    row.employeeNumber || ""
  }`.replace(/\s+/g, "_");

  function printImage(url) {
    if (!url) return;

    const w = window.open("", "PRINT", "height=700,width=900");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Print ${filenameBase} (${side})</title>
          <style>
            @page {
              margin: 0;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
            }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card {
              width: 350mm;
              height: 150mm;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <img
              src="${url}"
              onload="window.focus();window.print();window.close();"
              alt="ID ${side}"
            />
          </div>
        </body>
      </html>
    `);

    w.document.close();
  }

  async function handleDownload() {
    if (!relativePath) return;

    setDownloading(true);
    try {
      await downloadImage(relativePath, `${filenameBase}-${side}.png`);
    } catch (err) {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const backAvailable = Boolean(row.generatedBackImagePath);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">View ID</h2>
          <p className="text-gray-600 text-sm">Preview and details.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-3 py-1 rounded ${
              side === "front"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSide("front")}
          >
            Front
          </button>
          <button
            className={`flex-1 sm:flex-none px-3 py-1 rounded ${
              side === "back"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSide("back")}
            disabled={!backAvailable}
          >
            Back
          </button>
        </div>
      </div>

      <div className="border rounded-xl p-3 bg-gray-50 mb-3">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : src ? (
          <img
            src={src}
            alt="ID Preview"
            className="w-full h-auto max-h-60 sm:max-h-80 object-contain rounded-lg"
          />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
            {side === "back" ? "No back image available" : "No image available"}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {src && !loading && (
          <>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md text-sm disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {downloading ? "Downloading..." : `Download (${side})`}
            </button>

            <button
              onClick={() => printImage(src)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md text-sm"
            >
              Print ({side})
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6 overflow-y-auto flex-1">
        <InfoField
          label="Name"
          value={`${row.firstName} ${
            row.middleInitial ? row.middleInitial + " " : ""
          }${row.lastName}`}
        />
        <InfoField label="Employee Number" value={row.employeeNumber} />
        <InfoField label="Position" value={row.position} />
        <InfoField label="Type" value={row.type} />
        <InfoField label="Email" value={row.email} />
        <InfoField label="Phone" value={row.phone} />
        <InfoField label="Status" value={row.status} />
        <InfoField label="Date Generated" value={row.date} />
        <InfoField
          label="Emergency Contact"
          value={`${row.emFirstName} ${
            row.emMiddleInitial ? row.emMiddleInitial + " " : ""
          }${row.emLastName}`}
        />
        <InfoField label="Emergency Phone" value={row.emPhone} />
        <InfoField label="HR Name" value={row.hrName} />
        <InfoField label="HR Position" value={row.hrPosition} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        {typeof onEdit === "function" && (
          <button
            onClick={onEdit}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md text-sm"
          >
            Edit
          </button>
        )}

        <button
          onClick={onClose}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-2 rounded-md text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}