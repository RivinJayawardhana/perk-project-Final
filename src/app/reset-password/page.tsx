"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate token from URL
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check if we have a hash (Supabase already handled it)
        const hash = window.location.hash;
        console.log("[Reset Password] Hash:", hash);
        
        if (hash && hash.includes("access_token")) {
          // Supabase has already created a session
          console.log("[Reset Password] Session created by Supabase");
          setIsValidToken(true);
          setValidating(false);
          return;
        }

        // Fallback: check for type and code query parameters
        const type = searchParams.get("type");
        const code = searchParams.get("code");

        if (!type || !code) {
          setError("Invalid reset link. Please request a new one.");
          setValidating(false);
          return;
        }

        if (type !== "recovery") {
          setError("Invalid reset link. Please request a new one.");
          setValidating(false);
          return;
        }

        // Try to exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          setError("Reset link has expired or is invalid. Please request a new one.");
          setValidating(false);
          return;
        }

        setIsValidToken(true);
        setValidating(false);
      } catch (err) {
        setError("An error occurred while validating the reset link.");
        setValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message || "Failed to reset password");
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181c23] to-[#0f1117] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-[#e6b756] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center text-[#6b7280]">Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

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
          {!success && isValidToken ? (
            <>
              <h1 className="text-2xl font-bold text-[#181c23] mb-2">Set New Password</h1>
              <p className="text-[#6b7280] mb-6">Enter your new password below</p>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#181c23] mb-2">
                    New Password
                  </label>
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

                <div>
                  <label className="block text-sm font-medium text-[#181c23] mb-2">
                    Confirm Password
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

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-[#e6b756] hover:text-[#d4a543] font-medium"
                >
                  Back to Login
                </Link>
              </div>
            </>
          ) : success ? (
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
          ) : (
            <>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-[#181c23] mb-2">Invalid Reset Link</h1>
                <p className="text-[#6b7280] mb-6">{error}</p>

                <Link
                  href="/forgot-password"
                  className="inline-block w-full bg-[#e6b756] hover:bg-[#d4a543] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 text-center mb-3"
                >
                  Request New Link
                </Link>
                <Link
                  href="/login"
                  className="inline-block text-sm text-[#e6b756] hover:text-[#d4a543] font-medium"
                >
                  Back to Login
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#181c23] to-[#0f1117] flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 border-4 border-[#e6b756] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-[#6b7280]">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
