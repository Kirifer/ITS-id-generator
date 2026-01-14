import React, { useEffect, useRef } from "react";
import { getPositionsStore } from "../../store/positionStore";

export default function PositionSelect({ value, onChange, disabled, required }) {
  const hasFetched = useRef(false);

  const positions = getPositionsStore((state) => state.positions);
  const getPositions = getPositionsStore((state) => state.getPositions);
  const loading = getPositionsStore((state) => state.loading);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getPositions();
    }
  }, [getPositions]);

  return (
    <div>

      {loading ? (
        <div className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-gray-50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading positions...</span>
        </div>
      ) : (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position._id} value={position.name}>
              {position.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}