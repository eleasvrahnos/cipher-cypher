// RegisterForm.tsx - Page for users to register to submit their account information

"use client";

// IMPORTS - Axios
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  // username - Keeps track of currently-entered username in field
  const [username, setUsername] = useState("");
  // email - Keeps track of currently-entered email in field
  const [email, setEmail] = useState("");
  // password - Keeps track of currently-entered password in field
  const [password, setPassword] = useState("");
  // confirmPassword - Keeps track of currently-entered password in field, for security purposes
  const [confirmPassword, setConfirmPassword] = useState("");
  // success - Keeps track of success to give on form submission
  const [success, setSuccess] = useState<string | null>(null);
  // error - Keeps track of error to give on form submission
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match, give error if not
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      // Resets register fields and sets error/message fields accordingly
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setSuccess("Registration successful!");

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 750); // 750 ms for user experience purposes
    } catch (err: any) {
      // Server error shown in console and client
      console.error("Form submission error:", err);
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="mx-auto max-w-lg rounded-lg bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-white">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              pattern="[a-zA-Z0-9!@#$%&+]+"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex flex-col items-center justify-between gap-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
