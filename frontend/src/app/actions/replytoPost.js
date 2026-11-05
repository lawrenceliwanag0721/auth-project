'use server';

import { cookies } from 'next/headers';

export async function replyToPost(postId, content) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;

  const response = await fetch(
    `http://localhost:5000/api/post/${postId}/reply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `AuthToken=${authToken}`,
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create reply');
  }

  return data;
}