import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FaTimes } from "react-icons/fa";
import { patchPositionStore } from "../../store/positionStore";

export default function UpdatePositionModal({ position, onClose, onSuccess }) {
  const [name, setName] = useState(position.name);
  const [isActive, setIsActive] = useState(position.isActive);

  const patchPosition = patchPositionStore((state) => state.patchPosition);
  const loading = patchPositionStore((state) => state.loading);
  const success = patchPositionStore((state) => state.success);
  const error = patchPositionStore((state) => state.error);
  const message = patchPositionStore((state) => state.message);
  const reset = patchPositionStore((state) => state.reset);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patchPosition(position._id, { name: name.trim(), isActive });
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
          <h2 className="text-2xl font-bold text-gray-800">Update Position</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={isActive.toString()}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}