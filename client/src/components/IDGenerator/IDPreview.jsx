import React from 'react';
import { User, Mail, Phone, Briefcase, CreditCard } from 'lucide-react';

export default function IDPreview({ previewUrl, formHeight, livePreview, formData, photo }) {
  
  if (previewUrl) {
    return (
      <div
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full flex flex-col items-center justify-center"
        style={{
          height: formHeight ? `${formHeight}px` : 'auto',
          transition: 'height 0.3s ease'
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated ID Card</h3>
        <img
          src={previewUrl}
          alt="Generated ID"
          className="max-w-full max-h-full object-contain rounded-xl shadow-md"
        />
      </div>
    );
  }


  if (livePreview && (photo || formData?.firstName)) {
    const photoUrl = photo ? URL.createObjectURL(photo) : null;
    
    return (
      <div
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full"
        style={{
          height: formHeight ? `${formHeight}px` : 'auto',
          transition: 'height 0.3s ease'
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Live Preview</h3>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          {/* Photo Section */}
          <div className="flex justify-center mb-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg border-4 border-white shadow-md flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-3 text-sm">
            {formData?.firstName && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <User size={16} />
                  <span className="font-semibold">Name</span>
                </div>
                <div className="text-gray-800 font-medium">
                  {formData.firstName} {formData.middleInitial ? formData.middleInitial + '. ' : ''}{formData.lastName}
                </div>
              </div>
            )}

            {formData?.employeeNumber && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <CreditCard size={16} />
                  <span className="font-semibold">Employee #</span>
                </div>
                <div className="text-gray-800 font-medium">{formData.employeeNumber}</div>
              </div>
            )}

            {formData?.position && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Briefcase size={16} />
                  <span className="font-semibold">Position</span>
                </div>
                <div className="text-gray-800 font-medium">{formData.position}</div>
              </div>
            )}

            {formData?.email && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Mail size={16} />
                  <span className="font-semibold">Email</span>
                </div>
                <div className="text-gray-800 font-medium text-xs">{formData.email}</div>
              </div>
            )}

            {formData?.phone && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Phone size={16} />
                  <span className="font-semibold">Phone</span>
                </div>
                <div className="text-gray-800 font-medium">{formData.phone}</div>
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-xs text-purple-600 italic">
            This is a preview. The actual ID card will be generated after submission.
          </div>
        </div>
      </div>
    );
  }


  return (
    <div
      className="bg-white/50 rounded-2xl shadow-lg p-6 sm:p-8 w-full flex items-center justify-center"
      style={{
        height: formHeight ? `${formHeight}px` : 'auto',
        transition: 'height 0.3s ease'
      }}
    >
      <div className="text-center">
        <div className="text-gray-400 mb-2">
          <User size={48} className="mx-auto mb-3" />
        </div>
        <div className="text-gray-500 text-sm">
          {livePreview 
            ? 'Start filling the form to see a live preview'
            : 'Generated ID preview will appear here after submission'
          }
        </div>
      </div>
    </div>
  );
}