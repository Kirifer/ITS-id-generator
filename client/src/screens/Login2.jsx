// src/components/Login2.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { FaUser } from "react-icons/fa";
import "../index.css"; // Poppins font + .custom-bg

export default function ViewIDForm() {
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    const trimmed = idNumber.trim();
    if (!trimmed) {
      setError("Please enter your ID number.");
      return;
    }
    setError("");
    // Navigate to the viewer page with the ID number in the path
    navigate(`/view-generated-id/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen custom-bg p-4 sm:p-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-10 md:p-12 w-full max-w-lg text-center">
        {/* Logo & Title */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">IT Squarehub</h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
          View ID with ID Number
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8">
          Welcome! Please enter your details.
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-6 text-left">
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
              ID Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-400">
              <FaUser className="text-purple-500 mr-3 sm:mr-4 text-base sm:text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter Your ID Number"
                className="w-full bg-transparent outline-none text-sm sm:text-base"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-xs sm:text-sm mt-2">{error}</div>}
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-4 mt-3 sm:mt-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold"
            style={{
              backgroundColor: "#C4A4F4",
              color: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#a986e8")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#C4A4F4")}
          >
            View ID
          </button>
        </form>
      </div>
    </div>
  );
}