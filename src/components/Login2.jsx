import React from "react";
import logo from "../assets/images/logo.png";
import { FaUser } from "react-icons/fa";
import "../index.css"; // Poppins font + .custom-bg

export default function ViewIDForm() {
  return (
    <div className="flex items-center justify-center min-h-screen custom-bg">
      <div className="bg-white rounded-3xl shadow-lg p-12 w-full max-w-lg text-center">
        {/* Logo & Title */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 mr-4" />
          <h1 className="text-3xl font-extrabold text-gray-800">IT Squarehub</h1>
        </div>

        {/* Subtitle - Slightly bigger */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          View ID with ID Number
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Welcome! Please enter your details.
        </p>

        {/* Form */}
        <form>
          <div className="mb-6 text-left">
            <label className="block text-base font-semibold text-gray-700 mb-3">
              ID Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-5 py-4 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-400">
              <FaUser className="text-purple-500 mr-4 text-lg" />
              <input
                type="text"
                placeholder="Enter Your ID Number"
                className="w-full bg-transparent outline-none text-base"
              />
            </div>
          </div>

          {/* View ID Button */}
          <button
            type="submit"
            className="w-full py-4 mt-4 rounded-xl"
            style={{
              backgroundColor: "#C4A4F4",
              color: "#fff",
              fontSize: "1.125rem",
              fontWeight: "600",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#a986e8") // darker shade
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#C4A4F4")
            }
          >
            View ID
          </button>
        </form>
      </div>
    </div>
  );
}
