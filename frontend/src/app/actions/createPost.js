'use server'
import { cookies } from 'next/headers'
//import { revalidatePath } from 'next/cache'

export async function createPost(title, content) {
  const cookieStore = await cookies()
  const token = cookieStore.get('AuthToken')?.value

  const res = await fetch('http://localhost:5000/api/post/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `AuthToken=${token}`,
    },
    body: JSON.stringify({ title, content }),
  })

  if (!res.ok) {
  const errBody = await res.json().catch(() => null)
  console.error('Status:', res.status, errBody)
  throw new Error('Failed to create post')
  }
  const data = await res.json();
  console.log("this is what it looks like:")
  console.log(data)
  //revalidatePath('/home')
  return data;
}