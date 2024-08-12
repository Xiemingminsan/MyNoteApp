"use client"; // Ensure this is treated as a client component

import React, { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log(data.message);

    if (res.ok) {
      setUsername("");
      setPassword("");
      alert("Sign up successful!");
      window.location.href = "/components/login";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm">
        <div className="text-center text-2xl font-bold mb-6 text-black">
          Sign Up To Create an Account
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4 w-full">
            <input
              className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="mb-4 w-full">
            <input
              className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            SIGNUP
          </button>
          <div className="mt-4">
            <Link
              href="/components/login"
              className="text-blue-500 hover:text-blue-700"
            >
              Already have one? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
