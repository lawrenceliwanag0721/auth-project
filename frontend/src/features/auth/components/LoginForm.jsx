"use client"

import React, { useState } from 'react'
import { PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation'
import { signIn } from '@/app/actions/authActions'
import RegisterForm from './RegisterForm'

export default function LoginForm() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  const signin = async (data) => {
    const result = await signIn(data);
    router.replace("/home");
    return result;
  }

  const objectify = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    signin(data);
  }

  return (
    <div className="grid h-full w-full max-w-xl">
      <div
        aria-hidden={isRegistering}
        inert={isRegistering}
        className={`col-start-1 row-start-1 bg-white rounded-lg flex flex-col justify-center items-center w-full h-full gap-4 p-8 transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none ${
          isRegistering ? 'pointer-events-none opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-3xl text-black">Login</p>
        <form onSubmit={objectify} className='flex flex-col gap-4 w-full'>
          <input
            type="text"
            name="username"
            placeholder="username"
            autoComplete="username"
            className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
            className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
          />
          <button type="submit" className="w-full bg-mist-900 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </form>

        {registrationMessage && <p role="status" className="text-center text-sm text-green-700">{registrationMessage}</p>}
        <div className="flex flex-row gap-4 w-full">
          <button type="button" className="w-full border border-black/30 px-4 py-2 rounded-lg">
            Google
          </button>
          <button
            type="button"
            onClick={() => {
              setRegistrationMessage('');
              setIsRegistering(true);
            }}
            className="w-full border border-black/30 px-4 py-2 rounded-lg flex flex-row gap-2 justify-center items-center"
          >
            <PencilLine size={16}/>
            Register
          </button>
        </div>
      </div>

      <RegisterForm
        isActive={isRegistering}
        onLogin={() => setIsRegistering(false)}
        onRegistered={(message) => {
          setRegistrationMessage(message);
          setIsRegistering(false);
        }}
      />
    </div>
  )
}
