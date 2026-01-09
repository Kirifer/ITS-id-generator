import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { loginStore, authCheckStore } from "../store/authStore";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login, loading, success, error, message, reset } = loginStore();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  useEffect(() => {
    let mounted = true;

    const handleSuccess = async () => {
      if (success && mounted) {
        authCheckStore.getState().reset();

        await authCheckStore.getState().authCheck();

        const userRole = authCheckStore.getState().message?.role;

        if (mounted) {
          if (userRole === "Admin") {
            navigate("/dashboard", { replace: true });
          } else if (userRole === "Approver") {
            navigate("/approver-dashboard", { replace: true });
          }

          reset();
        }
      }
    };

    handleSuccess();

    return () => {
      mounted = false;
    };
  }, [success, navigate, reset]);

  useEffect(() => {
    if (error && message) {
      toast.error(message);
      reset();
    }
  }, [error, message, reset]);

  return (
    <div className="flex custom-bg items-center justify-center min-h-screen p-6 font-poppins bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[500px] p-10 rounded-[20px] shadow-xl space-y-6"
      >
        <div className="flex items-center justify-center mb-4 space-x-4">
          <img src={logo} alt="Logo" className="w-[80px] h-[73px]" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            IT Squarehub
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Log in to Your Account
        </h2>
        <p className="text-center text-sm text-gray-800">
          Welcome back! Please enter your details.
        </p>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Username
          </label>
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

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Password
          </label>
          <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
            <Lock className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
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
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>


        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
