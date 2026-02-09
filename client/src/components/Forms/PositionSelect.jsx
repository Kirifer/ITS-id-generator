import React, { useEffect, useRef } from "react";
import { getPositionsStore } from "../../store/positionStore";

export default function PositionSelect({
  value,
  onChange,
  disabled,
  required,
  error,
}) {
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
        <div
          className={`flex items-center justify-center py-2 px-4 rounded-lg bg-gray-50 ${
            error ? "border border-red-500" : "border border-gray-300"
          }`}
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            Loading positions...
          </span>
        </div>
      ) : (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border border-red-500" : "border border-gray-300"
          }`}
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
