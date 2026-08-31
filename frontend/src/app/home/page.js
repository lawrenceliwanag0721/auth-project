import NewsFeed from '@/components/NewsFeed'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('AuthToken')?.value;

  if (!authToken) {
    redirect('/')
  }

  const postsRes = await fetch("http://localhost:5000/api/post/", {
    method: "GET",
    headers: {
      Cookie: `AuthToken=${authToken}`,
    },
  });

  if(postsRes.status === 401) redirect('/');
  if (!postsRes.ok) throw new Error('Failed to fetch posts');
  const posts = postsRes.ok ? await postsRes.json() :[];

  return (
    <main className="flex flex-col h-screen w-full items-center">
      <NewsFeed props={posts}/>
    </main>
  );
}