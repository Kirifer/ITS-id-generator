import { FaSearch } from "react-icons/fa";
import { useEffect, useRef } from "react";
import Dropdown from "../Common/Dropdown";
import { idCardFilterStore } from "../../store/filterStore";

export default function FilterBar() {
  const { filters, setFilter, fetchIdCards } = idCardFilterStore();
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilter("search", value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value === "All" ? "" : e.target.value;
    setFilter("type", value);
    fetchIdCards();
  };

  const handleStatusChange = (e) => {
    const value = e.target.value === "All" ? "" : e.target.value;
    setFilter("status", value);
    fetchIdCards();
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchIdCards();
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters.search, fetchIdCards]);

  const typeDisplayValue = filters.type || "All";
  const statusDisplayValue = filters.status || "All";

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

      <div className="flex gap-3 flex-wrap items-center">
        <Dropdown
          label="Type"
          options={["All", "Intern", "Employee"]}
          value={typeDisplayValue}
          onChange={handleTypeChange}
        />
        <Dropdown
          label="Status"
          options={["All", "Approved", "Pending", "Rejected"]}
          value={statusDisplayValue}
          onChange={handleStatusChange}
        />

        <div className="relative">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600"
            size={14}
          />
          <input
            type="text"
            placeholder="Search by name, ID, or position..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-8 pr-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
