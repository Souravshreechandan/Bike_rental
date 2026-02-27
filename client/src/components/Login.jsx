import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState("login"); // login | register

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Disable background scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // LOGIN / REGISTER
  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setError("");

      if (state === "register" && password !== confirmPassword) {
        return setError("Passwords do not match");
      }

      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      setLoading(false);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message || "Server error");
    }
  };

  const getTitle = () => {
    return state === "login" ? "Welcome Back" : "Create Account";
  };

  const handleClose = () => {
    setShowLogin(false);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-5"
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
          <p className="text-sm text-gray-500">
            Login to continue to your account
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* NAME (REGISTER) */}
        {state === "register" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none transition"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1 relative">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-primary outline-none transition"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-xs cursor-pointer text-primary font-medium select-none"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* CONFIRM PASSWORD (REGISTER) */}
        {state === "register" && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none transition"
              required
            />
          </div>
        )}

        {/* SWITCH LOGIN / REGISTER */}
        <p className="text-sm text-center text-gray-600">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setState(state === "login" ? "register" : "login");
              setError("");
            }}
            className="text-primary font-semibold cursor-pointer hover:underline"
          >
            {state === "login" ? "Sign Up" : "Login"}
          </span>
        </p>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-primary hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : state === "login"
            ? "Login"
            : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Login;