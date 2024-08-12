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
    <div className="relative min-h-screen font-raleway bg-gray-100 flex items-center justify-center">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="top absolute w-full h-full">
          <div className="before:absolute before:content-[''] before:block before:w-[200vmax] before:h-[200vmax] before:top-1/2 before:left-1/2 before:mt-[-100vmax] before:rotate-[45deg] before:bg-[#e46569] before:opacity-65 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.445,0.05,0,1)]"></div>
          <div className="after:absolute after:content-[''] after:block after:w-[200vmax] after:h-[200vmax] after:top-1/2 after:left-1/2 after:mt-[-100vmax] after:rotate-[135deg] after:bg-[#ecaf81] after:opacity-65 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.445,0.05,0,1)]"></div>
        </div>
        <div className="bottom absolute w-full h-full">
          <div className="before:absolute before:content-[''] before:block before:w-[200vmax] before:h-[200vmax] before:top-1/2 before:left-1/2 before:mt-[-100vmax] before:rotate-[-45deg] before:bg-[#60b8d4] before:opacity-65 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.445,0.05,0,1)]"></div>
          <div className="after:absolute after:content-[''] after:block after:w-[200vmax] after:h-[200vmax] after:top-1/2 after:left-1/2 after:mt-[-100vmax] after:rotate-[-135deg] after:bg-[#3745b5] after:opacity-65 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.445,0.05,0,1)]"></div>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center text-2xl font-bold mb-6 text-black">
          Sign Up To Create an Account
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <input
              className="border border-gray-300 text-black rounded-md px-4 py-2 w-full"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
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
            className="bg-custom-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            SIGN UP
          </button>
          <div className="mt-4 text-center">
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
