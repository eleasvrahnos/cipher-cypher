// LoginForm.tsx - Page for users to login to retrieve their account information

"use client";

// IMPORTS - Axios
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";

const LoginForm = () => {
  // email - Keeps track of currently-entered email in field
  const [email, setEmail] = useState<string>("");
  // password - Keeps track of currently-entered password in field
  const [password, setPassword] = useState<string>("");
  // message - Keeps track of message to give on form submission
  const [message, setMessage] = useState<string | null>(null);
  // error - Keeps track of error to give on form submission
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // On form submission, sets token for user auto-login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    axios
      .post("/api/auth/login", payload)
      .then((res) => {
        cookie.set("token", res.data.token, { expires: 1 });
        setError(null);
        setMessage("Successfully logged in!");
        router.push("/");
      })
      .catch((err) => {
        setError(err?.response?.data?.message);
      });
  };

  // Redirects user to register form
  const handleRegister = () => {
    router.push("/register");
  };

  const handleForgotPassword = () => {
    router.push("/password/resetRequest");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="mx-auto max-w-lg rounded-lg bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-white text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              pattern="[a-zA-Z0-9!@#$%&+.]+"
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
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              New here?{" "}
              <a
                onClick={handleRegister}
                className="cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
              >
                Register
              </a>
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Forgot your password?{" "}
              <a
                onClick={handleForgotPassword}
                className="cursor-pointer text-blue-400 hover:text-blue-500 hover:underline"
              >
                Reset Password
              </a>
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
