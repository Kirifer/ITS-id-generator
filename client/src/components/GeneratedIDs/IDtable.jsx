import React, { useMemo } from "react";
import { Eye, Pencil, Trash2, FileCheck, Check, X } from "lucide-react";
import { idCardFilterStore } from "../../store/filterStore";

export default function IDTable({
  canView,
  canEdit,
  canDelete,
  canApprove,
  canReject,
  canGenerate,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onGenerate,
  statusBasedButtons,
  externalLoading,
}) {
  const items = idCardFilterStore((state) => state.data);
  const loading = idCardFilterStore((state) => state.loading);
  const error = idCardFilterStore((state) => state.error);

  const isLoading = externalLoading || loading;

  const fmtDate = (iso) => {
    const d = iso ? new Date(iso) : null;
    if (!d || Number.isNaN(+d)) return "";
    return d.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredData = useMemo(() => {
    return items.map((id) => ({
      _id: id._id,
      firstName: id?.fullName?.firstName || "",
      middleInitial: id?.fullName?.middleInitial || "",
      lastName: id?.fullName?.lastName || "",
      employeeNumber: id?.employeeNumber || "",
      position: id?.position || "",
      type: id?.type || "",
      status: id?.status || "",
      email: id?.contactDetails?.email || "",
      phone: id?.contactDetails?.phone || "",
      date: fmtDate(id.createdAt),
      emFirstName: id?.emergencyContact?.firstName || "",
      emMiddleInitial: id?.emergencyContact?.middleInitial || "",
      emLastName: id?.emergencyContact?.lastName || "",
      emPhone: id?.emergencyContact?.phone || "",
      hrName: id?.hrDetails?.name || "",
      hrPosition: id?.hrDetails?.position || "",
      generatedFrontImagePath:
        id?.generatedFrontImagePath || id?.generatedImagePath || "",
      generatedBackImagePath: id?.generatedBackImagePath || "",
      photoPath: id?.photoPath || "",
      isGenerated: id?.isGenerated || false,
    }));
  }, [items]);

  const showActions = canView || canEdit || canDelete || canGenerate;
  const showStatusColumn = canApprove || canReject;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar" style={{ height: "630px" }}>
        {isLoading ? (
          <div className="p-6 text-gray-600 text-sm">Loading…</div>
        ) : error ? (
          <div className="p-6 text-red-600 text-sm">{error}</div>
        ) : (
          <table className="min-w-full text-sm text-center border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-[#D0CAF3] text-gray-800 font-extrabold">
              <tr>
                <th className="p-4 rounded-tl-2xl whitespace-nowrap">Name</th>
                <th className="p-4 whitespace-nowrap">Type</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Generated</th>
                <th className="p-4 whitespace-nowrap">Date Generated</th>
                {showActions && <th className="p-4 whitespace-nowrap">Actions</th>}
                {showStatusColumn && (
                  <th className="p-4 rounded-tr-2xl whitespace-nowrap">Approval</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((id, index) => (
                  <tr
                    key={id._id || index}
                    className="bg-white even:bg-gray-100"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {id.firstName} {id.lastName}
                    </td>
                    <td className="p-4 whitespace-nowrap">{id.type}</td>
                    <td className="p-4 whitespace-nowrap">{id.status}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        {id.isGenerated ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <X size={16} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">{id.date}</td>
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
                          {canGenerate &&
                            id.status === "Approved" &&
                            !id.isGenerated && (
                              <FileCheck
                                size={16}
                                className="cursor-pointer text-green-600"
                                onClick={() => onGenerate(id)}
                              />
                            )}
                        </div>
                      </td>
                    )}
                    {showStatusColumn && (
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {statusBasedButtons && (
                            <>
                              {id.status === "Pending" && canApprove && (
                                <button
                                  onClick={() => onApprove(id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                                >
                                  Approve
                                </button>
                              )}
                              {id.status === "Pending" && canReject && (
                                <button
                                  onClick={() => onReject(id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                                >
                                  Reject
                                </button>
                              )}
                              {id.status === "Approved" && canReject && (
                                <button
                                  onClick={() => onReject(id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                                >
                                  Reject
                                </button>
                              )}
                              {id.status === "Rejected" && canApprove && (
                                <button
                                  onClick={() => onApprove(id)}
                                  className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
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
                    colSpan={
                      5 +
                      (showActions ? 1 : 0) +
                      (showStatusColumn ? 1 : 0)
                    }
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