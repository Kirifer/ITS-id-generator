import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo.png';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      });

      // Save token + role in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      // Redirect based on role
      if (res.data.user.role === 'Admin') {
        navigate('/dashboard');
      } else if (res.data.user.role === 'Approver') {
        navigate('/approver-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex custom-bg items-center justify-center min-h-screen p-6 font-poppins bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[500px] p-10 rounded-[20px] shadow-xl space-y-6"
      >
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-4 space-x-4">
          <img src={logo} alt="Logo" className="w-[80px] h-[73px]" />
          <h1 className="text-3xl font-extrabold text-gray-800">IT Squarehub</h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Log in to Your Account</h2>
        <p className="text-center text-sm text-gray-800">
          Welcome back! Please enter your details.
        </p>

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Username</label>
          <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Your Username"
              className="w-full outline-none text-sm"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
          <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
            <Lock className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full outline-none text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-800">
            <input type="checkbox" className="mr-2" /> Remember Me
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
