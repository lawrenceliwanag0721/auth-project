'use server'

import { cookies } from 'next/headers'

export async function createPost(title, content, image) {
  const cookieStore = await cookies()
  const token = cookieStore.get('AuthToken')?.value
  const formData = new FormData()

  formData.append('title', title)
  formData.append('content', content)

  if (image) {
    formData.append('image', image)
  }
  const res = await fetch(
    'http://localhost:5000/api/post/',
    {
      method: 'POST',
      headers: {
        Cookie: `AuthToken=${token}`,
      },
      body: formData,
    }
  )

  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    console.error('Status:', res.status, errBody)
    throw new Error('Failed to create post')
  }
  const data = await res.json()
  console.log('this is what it looks like:')
  console.log(data)

  return data
}