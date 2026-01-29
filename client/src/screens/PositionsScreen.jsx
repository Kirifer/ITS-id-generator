import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import DeletePositionModal from "../components/Modal/DeletePositionModal";
import UpdatePositionModal from "../components/Modal/UpdatePositionModal";
import { getAllPositionsStore, createPositionStore } from "../store/positionStore";

export default function PositionsScreen() {
  const mainRef = useRef(null);
  const hasFetched = useRef(false);

  const allPositions = getAllPositionsStore((state) => state.allPositions);
  const getAllPositions = getAllPositionsStore((state) => state.getAllPositions);
  const loading = getAllPositionsStore((state) => state.loading);

  const createPosition = createPositionStore((state) => state.createPosition);
  const createLoading = createPositionStore((state) => state.loading);
  const createSuccess = createPositionStore((state) => state.success);
  const createError = createPositionStore((state) => state.error);
  const createMessage = createPositionStore((state) => state.message);
  const resetCreate = createPositionStore((state) => state.reset);

  const [positionName, setPositionName] = useState("");
  const [updateModal, setUpdateModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getAllPositions();
    }
  }, [getAllPositions]);

  useEffect(() => {
    if (createSuccess && createMessage) {
      toast.success(createMessage);
      resetCreate();
    }
    if (createError && createMessage) {
      toast.error(createMessage);
      resetCreate();
    }
  }, [createSuccess, createError, createMessage, resetCreate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!positionName.trim()) return;
    try {
      await createPosition({ name: positionName.trim() });
      setPositionName("");
      getAllPositions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    getAllPositions();
  };

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={true} />
      <main ref={mainRef} className="flex-1 overflow-auto custom-bg">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-screen-xl mx-auto">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Add New Position
              </h2>
              <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  placeholder="Enter position name"
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  disabled={createLoading}
                />
                <button
                  type="submit"
                  disabled={createLoading || !positionName.trim()}
                  className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                >
                  {createLoading ? "Adding..." : "Add Position"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 flex flex-col max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-280px)]">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex-shrink-0">
                All Positions
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : allPositions.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 text-base sm:text-lg">No positions found</p>
                </div>
              ) : (
                <>
                  <div className="sm:hidden flex-1 overflow-auto space-y-3">
                    {allPositions.map((position) => (
                      <div
                        key={position._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 mr-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {position.name}
                            </h3>
                          </div>
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full whitespace-nowrap ${
                              position.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {position.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setUpdateModal(position)}
                            className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal(position)}
                            disabled={!position.isActive}
                            className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block overflow-auto flex-1 border border-gray-200 rounded-lg">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr>
                          <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position Name
                          </th>
                          <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allPositions.map((position) => (
                          <tr key={position._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{position.name}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  position.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {position.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => setUpdateModal(position)}
                                className="text-blue-600 hover:text-blue-900 mx-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteModal(position)}
                                disabled={!position.isActive}
                                className="text-red-600 hover:text-red-900 mx-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      {updateModal && (
        <UpdatePositionModal
          position={updateModal}
          onClose={() => setUpdateModal(null)}
          onSuccess={handleRefresh}
        />
      )}
      {deleteModal && (
        <DeletePositionModal
          position={deleteModal}
          onClose={() => setDeleteModal(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}