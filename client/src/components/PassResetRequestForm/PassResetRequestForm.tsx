// PassResetRequestForm.tsx - Page for users to request a password reset link

"use client";

import { useState } from "react";
import axios from "axios";
import BackButton from "../BackButton/BackButton";
import { useRouter } from "next/navigation";

const PassResetRequestForm = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post(`${process.env.SERVER}/api/auth/passreset/request`, { email })
      .then((res) => {
        setError(null);
        setMessage("A password reset link has been sent to your email.");
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to send reset link.");
      });
  };

  const handleBackClick = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
     <BackButton handleBackClick={handleBackClick}/>
      <div className="mx-auto max-w-lg rounded-lg bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-white text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {message && <div className="text-green-500">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default PassResetRequestForm;
