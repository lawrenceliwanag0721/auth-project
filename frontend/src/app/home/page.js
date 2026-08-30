'use client'

import NewsFeed from '@/components/NewsFeed'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authRes = await fetch("http://localhost:5000/api/user/", {
          method: "POST",
          credentials: "include",
        });

        if (!authRes.ok) {
          router.replace('/');
          return;
        }

        setAuth(true);

        const postsRes = await fetch("http://localhost:5000/api/post/", {
          method: "GET",
          credentials: "include",
        });

        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data);
        }
      } catch (err) {
        console.log('Something went wrong');
        router.replace('/');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <main className="flex flex-col h-screen w-full items-center">
      {isAuth && <NewsFeed props={posts} />}
    </main>
  );
}