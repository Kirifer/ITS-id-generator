import React, { useEffect } from "react";
import { toast } from "sonner";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { deletePositionStore } from "../../store/positionStore";

export default function DeletePositionModal({ position, onClose, onSuccess }) {
  const deletePosition = deletePositionStore((state) => state.deletePosition);
  const loading = deletePositionStore((state) => state.loading);
  const success = deletePositionStore((state) => state.success);
  const error = deletePositionStore((state) => state.error);
  const message = deletePositionStore((state) => state.message);
  const reset = deletePositionStore((state) => state.reset);

  const isAlreadyInactive = !position.isActive;

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      reset();
    }
    if (error && message) {
      toast.error(message);
      reset();
    }
  }, [success, error, message, reset]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleDelete = async () => {
    if (isAlreadyInactive) {
      toast.error("Position is already inactive");
      return;
    }

    try {
      await deletePosition(position._id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Delete Position</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {isAlreadyInactive ? (
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <FaExclamationTriangle className="text-gray-600 text-3xl flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  This position is already inactive
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Position: <span className="font-semibold">{position.name}</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-3xl flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Are you sure you want to delete this position?
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Position: <span className="font-semibold">{position.name}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                This action will deactivate the position. It will no longer be available for use.
              </p>
            </>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              {isAlreadyInactive ? "Close" : "Cancel"}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || isAlreadyInactive}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}