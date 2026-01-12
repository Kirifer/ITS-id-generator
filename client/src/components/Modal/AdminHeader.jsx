import React from "react";

const AdminHeader = ({ admin }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold text-2xl">
            {admin.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {admin.username}
          </h3>
          <p className="text-sm text-gray-600">ID: {admin._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Created:</span>
          <p className="font-semibold text-gray-800">
            {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Updated:</span>
          <p className="font-semibold text-gray-800">
            {new Date(admin.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;