'use server'

import { cookies } from 'next/headers'

async function postRequest(postId, method, data) {
  const cookieStore = await cookies()
  const token = cookieStore.get('AuthToken')?.value
  const response = await fetch(`http://localhost:5000/api/post/${postId}`, {
    method,
    headers: {
      Cookie: `AuthToken=${token}`,
      ...(data ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.message || `Failed to ${method === 'PATCH' ? 'update' : 'delete'} post`)
  }

  return method === 'PATCH' ? response.json() : null
}

export async function updatePost(postId, data) {
  return await postRequest(postId, 'PATCH', data)
}

export async function deletePost(postId) {
  return await postRequest(postId, 'DELETE')
}
