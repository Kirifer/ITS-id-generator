import React from "react";
import { User, Lock, Shield, Trash2, Save, Eye, EyeOff } from "lucide-react";

const AdminForm = ({
  formData,
  isEditing,
  showPassword,
  setShowPassword,
  updateErrors,
  updateLoading,
  deleteLoading,
  handleInputChange,
  handleUpdate,
  handleDelete,
  handleCancel,
  setIsEditing,
}) => {
  return (
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
            disabled={!isEditing}
            required
          />
        </div>
        {updateErrors?.username && (
          <p className="text-red-500 text-xs mt-1">{updateErrors.username}</p>
        )}
      </div>

      {isEditing && (
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
            Must be at least 8 characters with uppercase, lowercase, number, and
            special character
          </p>
        </div>
      )}

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
          disabled={!isEditing}
        />
        <label
          htmlFor="isActive"
          className="text-sm font-semibold text-gray-800"
        >
          Active Account
        </label>
      </div>

      <div className="flex space-x-3 pt-4 border-t">
        {!isEditing ? (
          <>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleteLoading ? "Deleting..." : "Delete"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
              Edit Admin
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </form>
  );
};

export default AdminForm;