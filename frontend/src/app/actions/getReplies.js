'use server'
import { cookies } from 'next/headers'

export async function getReplies(postId) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('AuthToken')?.value

  const response = await fetch(
    `http://localhost:5000/api/post/${postId}/reply`,
    {
      method: 'GET',
      headers: {
        Cookie: `AuthToken=${authToken}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to retrieve replies')
  }

  return response.json()
}