"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const router = useRouter()
  const [isAuth, setAuth] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/", {
          method: "POST",
          credentials: "include",
        })

        if (response.ok) {
          router.replace('/home');
        } else {
          setAuth(false);
        }
      } catch (err) {
          setAuth(false);
      }
    }

    checkAuth()
  }, [router])

  return (
    <main className="flex flex-col h-screen w-full justify-center items-center">
      {!isAuth && <LoginForm/>}
    </main>
  )
}