import React from 'react';
import { User, CreditCard, Briefcase, Tag, Phone, UploadCloud } from 'lucide-react';
import InputWithIcon from '../Common/InputWithIcon';
import SelectWithIcon from '../Common/SelectWithIcon';

export default function EditPanel({ selectedId, setSelectedId, photo, setPhoto, onSubmit, onCancel }) {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Edit Details:</h2>
        <p className="text-gray-600 text-sm">Please provide the required information below.</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithIcon
              Icon={User}
              value={selectedId.firstName}
              onChange={(e) => setSelectedId({ ...selectedId, firstName: e.target.value })}
              placeholder="First Name"
              required
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.middleInitial}
              onChange={(e) => setSelectedId({ ...selectedId, middleInitial: e.target.value })}
              placeholder="Middle Initial"
              required
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.lastName}
              onChange={(e) => setSelectedId({ ...selectedId, lastName: e.target.value })}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">ID Number</label>
          <InputWithIcon
            Icon={CreditCard}
            value={selectedId.idNumber}
            onChange={(e) => setSelectedId({ ...selectedId, idNumber: e.target.value })}
            placeholder="Enter ID Number"
            required
          />
        </div>

        {/* Position and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectWithIcon
            Icon={Briefcase}
            value={selectedId.position}
            onChange={(e) => setSelectedId({ ...selectedId, position: e.target.value })}
            label="Position"
            options={['Full Stack Developer', 'Human Resources', 'Marketing', 'Creative', 'SEO']}
            required
          />
          <SelectWithIcon
            Icon={Tag}
            value={selectedId.type}
            onChange={(e) => setSelectedId({ ...selectedId, type: e.target.value })}
            label="Type"
            options={['Intern', 'Employee']}
            required
          />
        </div>

        {/* Emergency Contact Person */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Person</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputWithIcon
              Icon={User}
              value={selectedId.emergencyFirstName}
              onChange={(e) => setSelectedId({ ...selectedId, emergencyFirstName: e.target.value })}
              placeholder="First Name"
              required
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.emergencyMiddleInitial}
              onChange={(e) => setSelectedId({ ...selectedId, emergencyMiddleInitial: e.target.value })}
              placeholder="Middle Initial"
              required
            />
            <InputWithIcon
              Icon={User}
              value={selectedId.emergencyLastName}
              onChange={(e) => setSelectedId({ ...selectedId, emergencyLastName: e.target.value })}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* Emergency Contact Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Number</label>
          <InputWithIcon
            Icon={Phone}
            value={selectedId.emergencyContactNumber}
            onChange={(e) => setSelectedId({ ...selectedId, emergencyContactNumber: e.target.value })}
            placeholder="Enter Phone Number"
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
          <div
            className="flex flex-col items-center justify-center p-6 mb-7 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 cursor-pointer transition-colors duration-200 hover:border-purple-300 hover:text-purple-400"
            onClick={() => document.getElementById('photoEditUpload').click()}
            style={{ minHeight: '120px' }}
          >
            <UploadCloud size={32} />
            <p className={`mt-2 text-sm text-center ${photo ? 'text-purple-600' : ''}`}>
              {photo ? `Selected: ${photo.name}` : 'Click or drag a file to this area to upload.'}
            </p>
            <p className="text-xs text-center">Supported formats: JPEG & PNG. Max file size: 2MB.</p>
            <input
              type="file"
              id="photoEditUpload"
              className="hidden"
              accept=".jpeg,.jpg,.png"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
