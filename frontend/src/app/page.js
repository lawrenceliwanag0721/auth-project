"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/", {
          method: "GET",
          credentials: "include",
        })

        if (response.ok) {
          router.replace("/home")
        } else {
          router.replace("/login")
        }
      } catch (err) {
        router.replace("/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <main>
      checking token...
    </main>
  )
}