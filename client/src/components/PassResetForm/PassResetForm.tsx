// PassResetForm.tsx - Page for users to change their password, requires an authenticated token

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PassResetForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token is missing.");
      return;
    }

    const validateToken = async () => {
      try {
        const response = await axios.get(`/api/auth/validate-token?token=${token}`);
        if (!response.data.valid) {
          setError("Invalid token.");
        }
      } catch (err: any) {
        setError("Failed to validate token.");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match, give error if not
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      // Resets fields and sets error/message fields accordingly
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess("Password reset successful!");

      // Redirect to login page after a delay for user experience
      setTimeout(() => {
        router.push("/login");
      }, 750); // 750 ms for user experience purposes
    } catch (err: any) {
      // Handle and display error from server
      console.error("Form submission error:", err);
      setError(err.response?.data?.message || "An error occurred.");
      setSuccess(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="mx-auto max-w-lg rounded-lg bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-white">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex flex-col items-center justify-between gap-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reset Password
            </button>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassResetForm;
