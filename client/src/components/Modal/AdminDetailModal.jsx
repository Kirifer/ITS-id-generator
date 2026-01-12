import React, { useState, useEffect } from "react";
import { X, User, Shield, Trash2, Save, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import {
  useGetAdminByIdStore,
  useDeleteAdminStore,
  useUpdateAdminStore,
} from "../../store/adminStore";
import { toast } from "sonner";
import AdminHeader from "./AdminHeader";

const AdminDetailModal = ({ adminId, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    isActive: false,
  });

  const {
    getAdminById,
    loading: fetchLoading,
    admin,
    reset: resetGet,
  } = useGetAdminByIdStore();
  
  const {
    deleteAdmin,
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
    message: deleteMessage,
    reset: resetDelete,
  } = useDeleteAdminStore();

  const {
    updateAdmin,
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
    message: updateMessage,
    errors: updateErrors,
    reset: resetUpdate,
  } = useUpdateAdminStore();

  useEffect(() => {
    getAdminById(adminId);
    
    return () => {
      resetDelete();
      resetUpdate();
    };
  }, [adminId]);

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username || "",
        password: "",
        role: admin.role || "",
        isActive: admin.isActive || false,
      });
    }
  }, [admin]);

  useEffect(() => {
    if (deleteSuccess && deleteMessage) {
      toast.success(deleteMessage);
      resetDelete();
      onClose();
    }
  }, [deleteSuccess, deleteMessage, resetDelete, onClose]);

  useEffect(() => {
    if (deleteError && deleteMessage) {
      toast.error(deleteMessage);
      resetDelete();
    }
  }, [deleteError, deleteMessage, resetDelete]);

  useEffect(() => {
    if (updateSuccess && updateMessage) {
      toast.success(updateMessage);
      resetUpdate();
      setIsEditing(false);
      getAdminById(adminId);
    }
  }, [updateSuccess, updateMessage, resetUpdate, adminId]);

  useEffect(() => {
    if (updateError && updateMessage) {
      toast.error(updateMessage);
      resetUpdate();
    }
  }, [updateError, updateMessage, resetUpdate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updateData = {
      username: formData.username,
      isActive: formData.isActive,
    };
    if (formData.password) {
      updateData.password = formData.password;
    }
    updateAdmin(adminId, updateData);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteAdmin(adminId);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: admin.username || "",
      password: "",
      role: admin.role || "",
      isActive: admin.isActive || false,
    });
    setShowPassword(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      ></div>

      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto font-inter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : admin ? (
            <>
              <AdminHeader admin={admin} />
              
              <div className="mt-6">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Username
                      </label>
                      <div className="flex items-center px-4 py-3 border rounded-md border-gray-300 bg-gray-50">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">{admin.username}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Role
                      </label>
                      <div className="flex items-center px-4 py-3 border rounded-md border-gray-300 bg-gray-50">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">{admin.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 px-4 py-3 border rounded-md border-gray-300 bg-gray-50">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={admin.isActive}
                        disabled
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-semibold text-gray-800"
                      >
                        Active Account
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t mt-6">
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        disabled={deleteLoading}
                        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{deleteLoading ? "Deleting..." : "Delete Admin"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200"
                      >
                        Update Admin
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Username
                      </label>
                      <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Enter Username"
                          className="w-full outline-none text-sm"
                          required
                        />
                      </div>
                      {updateErrors?.username && (
                        <p className="text-red-500 text-xs mt-1">{updateErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Password (Leave blank to keep current)
                      </label>
                      <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
                        <Lock className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter New Password"
                          className="w-full outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {updateErrors?.password && (
                        <p className="text-red-500 text-xs mt-1">{updateErrors.password}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Role
                      </label>
                      <div className="flex items-center px-3 py-2 border rounded-md border-gray-300 bg-gray-50">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          className="w-full outline-none text-sm bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActiveEdit"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="isActiveEdit"
                        className="text-sm font-semibold text-gray-800"
                      >
                        Active Account
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="flex-1 flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span>{updateLoading ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Admin not found</p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[60]"
            onClick={handleCancelDelete}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[70] p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Delete Admin
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminDetailModal;