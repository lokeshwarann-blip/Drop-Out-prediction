import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ShaderBackground from "./ShaderBackground";

export default function Login({ setIsLoggedIn }) {
  const { setViewMode } = useApp();
  const [role, setRole] = useState("teacher");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleRoleChange(newRole) {
    setRole(newRole);
    setUsername("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter your username and password.");
      return;
    }
    
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch("http://localhost:8001/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      
      setViewMode(data.role);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-[#020617] text-white">
      {/* Dynamic WebGL Shader Background */}
      <ShaderBackground />

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl items-center justify-between gap-12 lg:gap-24">
        
        {/* LEFT SIDE */}
        <div className="flex-1 max-w-lg text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8 mx-auto md:mx-0 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
              <path d="M22 10 12 5 2 10l10 5 10-5Z" />
              <path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5" />
            </svg>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
            AI-Based Student<br />Dropout Prediction
          </h1>
          <p className="text-blue-400 text-sm tracking-widest uppercase font-bold mb-10">
            Predict • Prevent • Empower Student Success
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-center">
              <strong className="text-2xl font-bold">95%</strong>
              <span className="text-slate-400 text-xs uppercase tracking-wide mt-1">Prediction Accuracy</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-center">
              <strong className="text-2xl font-bold">1200+</strong>
              <span className="text-slate-400 text-xs uppercase tracking-wide mt-1">Students Analysed</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-center">
              <strong className="text-2xl font-bold">24/7</strong>
              <span className="text-slate-400 text-xs uppercase tracking-wide mt-1">AI Monitoring</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl flex flex-col justify-center">
              <strong className="text-2xl font-bold">AI</strong>
              <span className="text-slate-400 text-xs uppercase tracking-wide mt-1">Smart Counselling</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LOGIN PANEL */}
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl">
          <p className="text-slate-400 text-sm text-center mb-6">
            Faculty Intervention Platform
          </p>

          {/* Teacher / Counselor Toggle */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                role === "teacher" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
              onClick={() => handleRoleChange("teacher")}
            >
              <span>🍎</span>
              <span>Teacher</span>
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                role === "counselor" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
              onClick={() => handleRoleChange("counselor")}
            >
              <span>🧑‍💼</span>
              <span>Counselor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2" htmlFor="username">Username</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-none stroke-slate-400 stroke-[1.8]">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder={role === "teacher" ? "Enter Teacher ID" : "Enter Counselor ID"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 fill-none stroke-slate-400 stroke-[1.8]">
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-4"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Need help? Contact the college IT desk.
          </p>
        </div>
      </div>
    </div>
  );
}
