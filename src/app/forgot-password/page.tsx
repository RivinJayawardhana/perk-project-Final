"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c23] to-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Image src="/logo.png" alt="VentureNext" width={48} height={48} />
          <span className="text-3xl font-bold text-white">
            entureNext<span className="text-[#e6b756]">Admin</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {!success ? (
            <>
              <h1 className="text-2xl font-bold text-[#181c23] mb-2">Reset Password</h1>
              <p className="text-[#6b7280] mb-6">
                Enter your email address and we'll send you a link to reset your password
              </p>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#e6b756] hover:bg-[#d4a543] disabled:bg-[#cfa535] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#181c23] border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
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
          ) : (
            <>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12 text-[#10b981]" />
                </div>
                <h1 className="text-2xl font-bold text-[#181c23] mb-2">Check Your Email</h1>
                <p className="text-[#6b7280] mb-6">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> The reset link will expire in 24 hours. If you don't see the email, check your spam folder.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-block w-full bg-[#e6b756] hover:bg-[#d4a543] text-[#181c23] font-semibold py-3 rounded-lg transition duration-200 text-center"
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
