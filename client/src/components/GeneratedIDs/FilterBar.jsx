import { FaSearch } from 'react-icons/fa';
import Dropdown from '../Common/Dropdown';
export default function FilterBar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Generated IDs</h2>

      <div className="flex gap-3 flex-wrap items-center">
        <Dropdown
          label="Type"
          options={['All', 'Intern', 'Employee']}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <Dropdown
          label="Status"
          options={['All', 'Approved', 'Pending', 'Rejected']}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" size={14} />
          <input
            type="text"
            placeholder="Search by name, ID, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
