"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DirectPasswordResetPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      setLoading(false);
      return;
    }

    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        setError("Email or password is incorrect");
        setLoading(false);
        return;
      }

      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c23] to-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-full bg-[#e6b756] flex items-center justify-center text-2xl font-bold text-[#1a2233]">
            V
          </div>
          <span className="text-3xl font-bold text-white">
            VentureNext<span className="text-[#e6b756]">Admin</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {!success ? (
            <>
              <h1 className="text-2xl font-bold text-[#181c23] mb-2">Reset Password</h1>
              <p className="text-[#6b7280] mb-6">Reset your password instantly without email verification</p>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Password reset successfully!</p>
                    <p className="text-xs text-green-600">Redirecting to login...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
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

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-[#181c23] mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756] focus:border-transparent bg-white text-[#181c23] placeholder-[#9ca3af] disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#181c23] disabled:cursor-not-allowed"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-[#181c23] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756] focus:border-transparent bg-white text-[#181c23] placeholder-[#9ca3af] disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#181c23] disabled:cursor-not-allowed"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-1">Minimum 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#181c23] mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e6b756] focus:border-transparent bg-white text-[#181c23] placeholder-[#9ca3af] disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#181c23] disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#e6b756] hover:bg-[#d4a543] disabled:bg-[#cfa535] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#181c23] border-t-transparent rounded-full animate-spin"></span>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-[#6b7280]">
                  <Link
                    href="/forgot-password"
                    className="text-[#e6b756] hover:text-[#d4a543] font-medium"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p className="text-sm text-[#6b7280]">
                  <Link
                    href="/login"
                    className="text-[#e6b756] hover:text-[#d4a543] font-medium"
                  >
                    Back to Login
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-[#10b981]" />
                </div>
                <h1 className="text-2xl font-bold text-[#181c23] mb-2">Password Reset</h1>
                <p className="text-[#6b7280] mb-6">
                  Your password has been successfully reset. Redirecting to login...
                </p>

                <Link
                  href="/login"
                  className="inline-block w-full bg-[#e6b756] hover:bg-[#d4a543] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 text-center"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[#9ca3af] text-sm">
          Protected Admin Area • Supabase Authentication
        </p>
      </div>
    </div>
  );
}
