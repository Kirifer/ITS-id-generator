import { useState } from "react";

export default function useIDGeneratorValidation({
  formData,
  hr_name,
  hr_position,
  hr_id,
  hrSignature,
  getDisplayNumber,
}) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    // ---------- NAME ----------
    if (!formData.firstName?.trim()) e.firstName = true;
    if (!formData.middleInitial?.trim()) e.middleInitial = true;
    if (!formData.lastName?.trim()) e.lastName = true;

    // ---------- TYPE ----------
    if (!formData.type) e.type = true;

    // ---------- EMPLOYEE NUMBER ----------
    if (!formData.employeeNumber || getDisplayNumber().length < 5) {
      e.employeeNumber = true;
    }

    // ---------- POSITION ----------
    if (!formData.position) e.position = true;

    // ---------- EMAIL (FIXED ✅) ----------
    const emailLocalPart = formData.email?.split("@")[0];

    if (!emailLocalPart) {
      e.email = true;
    }

    // ---------- PHONE ----------
    if (!formData.phone || formData.phone.length < 13) {
      e.phone = true;
    }

    // ---------- EMERGENCY CONTACT ----------
    if (!formData.emFirstName?.trim()) e.emFirstName = true;
    if (!formData.emMiddleInitial?.trim()) e.emMiddleInitial = true;
    if (!formData.emLastName?.trim()) e.emLastName = true;

    if (!formData.emPhone || formData.emPhone.length < 13) {
      e.emPhone = true;
    }

    // ---------- HR ----------
    if (!hr_name?.trim()) e.hrName = true;
    if (!hr_position?.trim()) e.hrPosition = true;
    if (!hr_id && !hrSignature) e.hrSignature = true;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return { errors, validate, setErrors };
}
