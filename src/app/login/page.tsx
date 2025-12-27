"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c23] to-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Image 
            src="/logo.png" 
            alt="VentureNext Logo" 
            width={48} 
            height={48} 
            className="w-12 h-12"
          />
          <span className="text-3xl font-bold text-white">
            entureNext<span className="text-[#e6b756]">Admin</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-2xl font-bold text-[#181c23] mb-2">Admin Login</h1>
          <p className="text-[#6b7280] mb-6">Sign in to access the admin dashboard</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#181c23] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756] focus:border-transparent bg-white text-[#181c23] placeholder-[#9ca3af] disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#181c23]">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-[#e6b756] hover:text-[#d4a543] font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756] focus:border-transparent bg-white text-[#181c23] placeholder-[#9ca3af] disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#181c23] disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e6b756] hover:bg-[#d4a543] disabled:bg-[#cfa535] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#181c23] border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Password Reset Options */}
        <div className="space-y-2 text-center mb-6">
          <p className="text-sm text-[#9ca3af]">
            <a href="/reset-password-direct" className="text-[#e6b756] hover:text-[#d4a543] font-medium">
              Reset Password (Direct)
            </a>
          </p>
          <p className="text-sm text-[#9ca3af]">
           
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[#9ca3af] text-sm">
          Protected Admin Area • Supabase Authentication
        </p>
      </div>
    </div>
  );
}
