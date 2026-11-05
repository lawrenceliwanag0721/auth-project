import NewsFeed from '@/features/feed/components/NewsFeed'
import { getFeedPosts, ApiRequestError } from '@/lib/server/posts'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;

  if (!authToken) {
    redirect('/')
  }

  let posts
  try {
    posts = await getFeedPosts(authToken)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) redirect('/')
    throw error
  }

  return (
    <main className="flex flex-col h-screen w-full items-center">
      <NewsFeed initialPosts={posts}/>
    </main>
  );
}