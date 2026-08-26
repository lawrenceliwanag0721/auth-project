"use client"
import React from 'react'
import { PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter();
  const signin = async (data) => {
    const response = await fetch("http://localhost:5000/api/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
        console.log("success!");
    router.replace("/");

    return result;
  }
  const objectify = (e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password")
    };

    signin(data);
  }

  return (
    <div className="bg-white rounded-lg flex flex-col justify-center items-center w-full max-w-xl h-full gap-4 p-8">
        <p className="text-3xl text-black">Login</p>
        <form onSubmit={objectify} className='flex flex-col gap-4 w-full'>
          <input
            type="text"
            name="username"
            placeholder="username"
            className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            className="text-center w-full border border-black/30 text-black placeholder:text-black/60 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black/50"
          />

          <button type="submit" className="w-full bg-mist-900 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </form>



        <div className="flex flex-row gap-4 w-full">
          <button className="w-full border border-black/30 px-4 py-2 rounded-lg">Google</button>
          <button className="w-full border border-black/30 px-4 py-2 rounded-lg flex flex-row gap-2 justify-center items-center"><PencilLine size={16}/>Register</button>
        </div>
    </div>
  )
}
