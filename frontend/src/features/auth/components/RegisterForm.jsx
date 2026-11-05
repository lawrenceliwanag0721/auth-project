"use client"

import React, { useState } from 'react'
import { register } from '@/app/actions/authActions'

export default function RegisterForm({ isActive, onLogin, onRegistered }) {
  const [error, setError] = useState('');

  const submitRegistration = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    try {
      const result = await register(data);
      onRegistered(result.message || "Registration complete. Please log in.");
    } catch (registrationError) {
      setError(registrationError.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div
      aria-hidden={!isActive}
      inert={!isActive}
      className={`col-start-1 row-start-1 bg-white rounded-lg flex flex-col justify-center items-center w-full h-full gap-4 p-8 transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
        isActive ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
      }`}
    >
      <p className="text-3xl text-black">Create account</p>
      <form onSubmit={submitRegistration} className="flex flex-col gap-4 w-full">
        <input
          type="text"
          name="username"
          placeholder="username"
          autoComplete="username"
          required
          className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          autoComplete="email"
          required
          className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
          autoComplete="new-password"
          minLength={8}
          required
          className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
        />
        {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-mist-900 text-white px-4 py-2 rounded-lg">
          Register
        </button>
      </form>
      <button
        type="button"
        onClick={onLogin}
        className="w-full border border-black/30 px-4 py-2 rounded-lg"
      >
        Login
      </button>
    </div>
  )
}
