import React, { useEffect, useState } from "react";
import { UserPlus, Search, Users, Filter } from "lucide-react";
import { useGetAllAdminsStore, useFilterAdminStore } from "../store/adminStore";
import { toast } from "sonner";
import CreateAdminPanel from "../components/Forms/CreateAdminPanel";
import AdminDetailModal from "../components/Modal/AdminDetailModal";
import Sidebar from "../components/Sidebar";

const AdminManagement = () => {
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(undefined);

  const { getAllAdmins, loading: allLoading, error: allError, message: allMessage, admins: allAdmins, reset: resetAll } = useGetAllAdminsStore();
  const { filterAdmins, loading: filterLoading, error: filterError, message: filterMessage, admins: filteredAdmins, reset: resetFilter } = useFilterAdminStore();

  const hasActiveFilters = searchTerm !== "" || statusFilter !== undefined;
  const loading = hasActiveFilters ? filterLoading : allLoading;
  const error = hasActiveFilters ? filterError : allError;
  const message = hasActiveFilters ? filterMessage : allMessage;
  const admins = hasActiveFilters ? filteredAdmins : allAdmins;
  const reset = hasActiveFilters ? resetFilter : resetAll;

  useEffect(() => {
    getAllAdmins();
  }, []);

  useEffect(() => {
    if (error && message) {
      toast.error(message);
      reset();
    }
  }, [error, message, reset]);

  useEffect(() => {
    if (hasActiveFilters) {
      const delayDebounce = setTimeout(() => {
        filterAdmins(searchTerm, statusFilter);
      }, 300);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, statusFilter, hasActiveFilters]);

  const handleAdminClick = (adminId) => {
    setSelectedAdminId(adminId);
  };

  const handleCloseModal = () => {
    setSelectedAdminId(null);
    if (hasActiveFilters) {
      filterAdmins(searchTerm, statusFilter);
    } else {
      getAllAdmins();
    }
  };

  const handleCreateSuccess = () => {
    setShowCreatePanel(false);
    if (hasActiveFilters) {
      filterAdmins(searchTerm, statusFilter);
    } else {
      getAllAdmins();
    }
  };

  const panelOpen = showCreatePanel;
  const sidebarExpanded = !panelOpen;

  return (
    <div className="flex h-screen w-screen font-inter overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />
      <main className="flex-1 overflow-auto custom-bg">
        <div className="p-6">
          <div className="flex flex-col gap-6 w-full max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Admin Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage system administrators
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCreatePanel(true)}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Admin</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col max-h-[calc(100vh-220px)]">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={statusFilter === undefined ? "all" : statusFilter.toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setStatusFilter(value === "all" ? undefined : value === "true");
                    }}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No admins found</p>
                </div>
              ) : (
                <div className="overflow-auto flex-1">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Username
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr
                          key={admin._id}
                          onClick={() => handleAdminClick(admin._id)}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition duration-150"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-semibold">
                                  {admin.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">
                                {admin.username}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {admin.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                admin.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {admin.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showCreatePanel && (
        <CreateAdminPanel
          onClose={() => setShowCreatePanel(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {selectedAdminId && (
        <AdminDetailModal
          adminId={selectedAdminId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminManagement;