import { User, CreditCard, Briefcase, Tag, Phone, UploadCloud, ChevronDown } from 'lucide-react';

export default function IDGeneratorForm({
  formRef,
  formData,
  setFormData,
  photo,
  setPhoto,
  photoError,
  setPhotoError,
  onSubmit
}) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div ref={formRef} className="bg-white rounded-2xl shadow-lg pt-4 sm:pt-6 px-2 sm:px-8 pb-6 sm:pb-7 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Enter Details:</h2>
      <p className="text-gray-600 mb-4 text-sm">Please provide the required information below.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Middle Initial"
                maxLength={1}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.middleInitial}
                onChange={(e) => handleChange('middleInitial', e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="employeeNumber" className="block text-sm font-semibold text-gray-800 mb-1">Employee Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              id="employeeNumber"
              placeholder="Enter Employee Number"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              value={formData.employeeNumber}
              onChange={(e) => handleChange('employeeNumber', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-800 mb-1">Position</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="position"
                className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${formData.position ? 'text-gray-900' : 'text-gray-400'}`}
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                required
              >
                <option value="" disabled hidden>Select Position</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Creative">Creative</option>
                <option value="SEO">SEO</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-800 mb-1">Type</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="type"
                className={`appearance-none w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm bg-white ${formData.type ? 'text-gray-900' : 'text-gray-400'}`}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
              >
                <option value="" disabled hidden>Select Type</option>
                <option value="Intern">Intern</option>
                <option value="Employee">Employee</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
          <input
            type="tel"
            id="phone"
            placeholder="Enter Phone Number"
            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>

        {/* Emergency Contact Person */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Person</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.emFirstName}
                onChange={(e) => handleChange('emFirstName', e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Middle Initial"
                maxLength={1}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.emMiddleInitial}
                onChange={(e) => handleChange('emMiddleInitial', e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
                value={formData.emLastName}
                onChange={(e) => handleChange('emLastName', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Number */}
        <div>
          <label htmlFor="emPhone" className="block text-sm font-semibold text-gray-800 mb-1">Emergency Contact Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="tel"
              id="emPhone"
              placeholder="Enter Phone Number"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              value={formData.emPhone}
              onChange={(e) => handleChange('emPhone', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Photo</label>
          <label
            htmlFor="photoUpload"
            className={`flex flex-col items-center justify-center p-6 mb-3 border-2 border-dashed rounded-lg text-gray-500 cursor-pointer transition-colors duration-200
              hover:border-purple-300 hover:text-purple-400 focus-within:border-purple-300 focus-within:text-purple-400`}
            style={{ minHeight: '120px' }}
          >
            <UploadCloud size={32} />
            <p className={`mt-2 text-sm text-center ${photo ? 'text-purple-600' : ''}`}>
              {photo ? `Selected: ${photo.name}` : 'Click or drag a file to this area to upload.'}
            </p>
            <p className="text-xs text-center">Supported formats: JPEG & PNG. Max file size: 2MB.</p>
            {photoError && <p className="text-xs text-center text-red-500 mt-2">{photoError}</p>}
          </label>
          <input
            type="file"
            id="photoUpload"
            className="hidden"
            accept=".jpeg,.jpg,.png"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              if (selectedFile) {
                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type)) {
                  setPhoto(null);
                  setPhotoError('Invalid file type. Only JPEG and PNG are allowed.');
                  return;
                }
                if (selectedFile.size > 2 * 1024 * 1024) {
                  setPhoto(null);
                  setPhotoError('File too large. Max 2MB.');
                  return;
                }
                setPhoto(selectedFile);
                setPhotoError('');
              }
            }}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-3 rounded-md transition duration-200 text-lg"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
