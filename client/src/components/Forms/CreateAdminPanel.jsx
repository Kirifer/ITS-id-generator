import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, User, Lock, Shield } from "lucide-react";
import { useCreateAdminStore } from "../../store/adminStore";
import { toast } from "sonner";

const CreateAdminPanel = ({ onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Admin",
    isActive: true,
  });

  const { createAdmin, loading, success, error, message, errors, reset } = useCreateAdminStore();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdmin(formData);
  };

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      reset();
      onSuccess();
    }
  }, [success, message, reset, onSuccess]);

  useEffect(() => {
    if (error && message) {
      toast.error(message);
      if (errors && Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, errorMsg]) => {
          toast.error(`${field}: ${errorMsg}`);
        });
      }
    }
  }, [error, message, errors]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-inter animate-slide-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Admin</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              {errors?.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
                <Lock className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  className="w-full outline-none text-sm"
                  required
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
              {errors?.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
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
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-800">
                Active Account
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAdminPanel;