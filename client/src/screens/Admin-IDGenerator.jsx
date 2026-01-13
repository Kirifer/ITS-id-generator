import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { idCardPostStore } from "../store/cardStore";
import Sidebar from "../components/Sidebar";
import IDGeneratorForm from "../components/IDGenerator/IDGenerator";
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
    hrName: "",
    hrPosition: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");

  // 🔑 hrSignature can be:
  // File (manual upload) OR string (existing signaturePath)
  const [hrSignature, setHrSignature] = useState(null);
  const [hrSignatureError, setHrSignatureError] = useState("");

  useEffect(() => {
  console.log("HR SIGNATURE:", hrSignature)
}, [hrSignature])

  const { loading, success, error, message, idCardPost, reset } =
    idCardPostStore();

  useLayoutEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.offsetHeight);
    }
  }, [formData, photo, hrSignature, previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* =====================
       BASIC REQUIRED CHECKS
    ===================== */

    if (!photo) {
      showMessageBoxIdGen("Please upload a photo.");
      return;
    }

   // Require signature ONLY if manual HR (no hrId)
if (!formData.hrId && !hrSignature) {
  showMessageBoxIdGen("Please upload HR signature.");
  return;
}


    /* =====================
       PHOTO VALIDATION
    ===================== */

    if (!["image/jpeg", "image/png", "image/jpg"].includes(photo.type)) {
      showMessageBoxIdGen(
        "Invalid photo file type. Only JPEG and PNG are allowed."
      );
      return;
    }

    if (photo.size > 4 * 1024 * 1024) {
      showMessageBoxIdGen(
        "Photo file too large. Maximum allowed file size is 4MB."
      );
      return;
    }

    /* =====================
       HR SIGNATURE VALIDATION
       (ONLY IF FILE)
    ===================== */

    if (hrSignature instanceof File) {
      if (
        !["image/jpeg", "image/png", "image/jpg"].includes(hrSignature.type)
      ) {
        showMessageBoxIdGen(
          "Invalid HR signature file type. Only JPEG and PNG are allowed."
        );
        return;
      }

      if (hrSignature.size > 4 * 1024 * 1024) {
        showMessageBoxIdGen(
          "HR signature file too large. Maximum allowed file size is 4MB."
        );
        return;
      }
    }

    /* =====================
       FORM DATA
    ===================== */

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    formDataToSend.append("photo", photo);

    // ✅ Manual HR upload
    if (hrSignature instanceof File) {
      formDataToSend.append("hrSignature", hrSignature);
    }

    

    /* =====================
       SUBMIT
    ===================== */

    const result = await idCardPost(formDataToSend);

    if (result) {
      showMessageBoxIdGen("ID generated and saved (Pending)!");

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
        hrName: "",
        hrPosition: "",
      });

      setPhoto(null);
      setPhotoError("");
      setHrSignature(null);
      setHrSignatureError("");
    } else {
      console.log(message);
      showMessageBoxIdGen(message || "ID generation failed!");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar expanded={sidebarExpanded} />

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
                hrSignature={hrSignature}
                setHrSignature={setHrSignature}
                hrSignatureError={hrSignatureError}
                setHrSignatureError={setHrSignatureError}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
