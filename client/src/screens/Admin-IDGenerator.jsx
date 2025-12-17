import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateIDStore } from "../store/generateStore";
import Sidebar from "../components/Sidebar";
import IDGeneratorForm from "../components/IDGenerator/IDGenerator";
import IDPreview from "../components/IDGenerator/IDPreview";
import { showMessageBoxIdGen } from "../utils/messageBoxIDGen";

export default function Admin_IDGenerator() {
  const [sidebarHover, setSidebarHover] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const sidebarExpanded = !selectedId || sidebarHover;
  const [previewUrl, setPreviewUrl] = useState("");
  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    employeeNumber: "",
    position: "",
    type: "",
    email: "",
    phone: "",
    emFirstName: "",
    emMiddleInitial: "",
    emLastName: "",
    emPhone: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const { loading, success, error, message, generateId, reset } =
    generateIDStore();

  useLayoutEffect(() => {
    if (formRef.current) setFormHeight(formRef.current.offsetHeight);
  }, [formData, photo, previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (photo) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(photo.type)) {
        showMessageBoxIdGen(
          "Invalid file type. Only JPEG and PNG are allowed."
        );
        return;
      }
      if (photo.size > 2 * 1024 * 1024) {
        showMessageBoxIdGen(
          "File too large. Maximum allowed file size is 2MB."
        );
        return;
      }
    }

    try {
      const credentials = { ...formData, photo };

      await generateId(credentials);

      if (success) {
        showMessageBoxIdGen("ID generated and saved (Pending)!");
        setPreviewUrl(message);
      } else {
        showMessageBoxIdGen(message || "ID generation failed!");
      }

      reset();
      setFormData({
        firstName: "",
        middleInitial: "",
        lastName: "",
        employeeNumber: "",
        position: "",
        type: "",
        email: "",
        phone: "",
        emFirstName: "",
        emMiddleInitial: "",
        emLastName: "",
        emPhone: "",
      });
      setPhoto(null);
      setPhotoError("");
    } catch (err) {
      showMessageBoxIdGen("Something went wrong during ID generation.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        expanded={sidebarExpanded}
      />

      <main className="flex-1 custom-bg overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 md:px-6 py-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-6">
            <div className="w-full md:flex-1">
              <IDGeneratorForm
                formRef={formRef}
                formData={formData}
                setFormData={setFormData}
                photo={photo}
                setPhoto={setPhoto}
                photoError={photoError}
                setPhotoError={setPhotoError}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="w-full md:flex-1">
              <IDPreview previewUrl={previewUrl} formHeight={formHeight} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
