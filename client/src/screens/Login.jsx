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
    <div className="flex custom-bg items-center justify-center min-h-screen p-4 sm:p-6 font-poppins bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-[500px] p-6 sm:p-8 md:p-10 rounded-[20px] shadow-xl space-y-4 sm:space-y-6"
      >
        <div className="flex items-center justify-center mb-2 sm:mb-4 space-x-3 sm:space-x-4">
          <img src={logo} alt="Logo" className="w-[60px] h-[55px] sm:w-[80px] sm:h-[73px]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            IT Squarehub
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Log in to Your Account
        </h2>
        <p className="text-center text-xs sm:text-sm text-gray-800">
          Welcome back! Please enter your details.
        </p>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
            Username
          </label>
          <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
            <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Your Username"
              className="w-full outline-none text-xs sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1">
            Password
          </label>
          <div className="flex items-center px-3 py-2 border rounded-md border-gray-300">
            <Lock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full outline-none text-xs sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 focus:outline-none flex-shrink-0"
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
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 sm:py-2.5 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;