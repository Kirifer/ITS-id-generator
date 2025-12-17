import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function IDTable({
  loading,
  err,
  filteredData,
  canView,
  canEdit,
  canDelete,
  canApprove,
  canReject,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  statusBasedButtons,
}) {
  const showActions =
    canView || canEdit || canDelete || canApprove || canReject;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full">
      <div
        className="overflow-y-auto custom-scrollbar"
        style={{ height: "630px" }}
      >
        {loading ? (
          <div className="p-6 text-gray-600 text-sm">Loading…</div>
        ) : err ? (
          <div className="p-6 text-red-600 text-sm">{err}</div>
        ) : (
          <table className="min-w-full text-sm text-center border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-[#D0CAF3] text-gray-800 font-extrabold">
              <tr>
                <th className="p-4 rounded-tl-2xl">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Generated</th>
                {showActions && <th className="p-4 rounded-tr-2xl">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((id, index) => (
                  <tr
                    key={id._id || index}
                    className="bg-white even:bg-gray-100"
                  >
                    <td className="p-4">
                      {id.firstName} {id.lastName}
                    </td>
                    <td className="p-4">{id.type}</td>
                    <td className="p-4">{id.status}</td>
                    <td className="p-4">{id.date}</td>
                    {showActions && (
                      <td className="p-4 text-purple-600">
                        <div className="flex justify-center gap-3">
                          {canView && (
                            <Eye
                              size={16}
                              className="cursor-pointer"
                              onClick={() => onView(id)}
                            />
                          )}
                          {canEdit && (
                            <Pencil
                              size={16}
                              className="cursor-pointer"
                              onClick={() => onEdit(id)}
                            />
                          )}
                          {canDelete && (
                            <Trash2
                              size={16}
                              className="cursor-pointer"
                              onClick={() => onDelete(id)}
                            />
                          )}
                          {statusBasedButtons && (
                            <>
                              {id.status === "Pending" && canApprove && (
                                <button
                                  onClick={() => onApprove(id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>
                              )}
                              {id.status === "Pending" && canReject && (
                                <button
                                  onClick={() => onReject(id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Reject
                                </button>
                              )}
                              {id.status === "Approved" && canReject && (
                                <button
                                  onClick={() => onReject(id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Reject
                                </button>
                              )}
                              {id.status === "Rejected" && canApprove && (
                                <button
                                  onClick={() => onApprove(id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Approve
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={showActions ? 5 : 4}
                    className="p-4 text-gray-500 italic"
                  >
                    No matching results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
