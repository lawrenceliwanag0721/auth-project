'use client'

import React, { useState } from 'react'
import PostCard from '@/features/posts/components/Postcard'
export default function FollowingFeedSection({ posts = [] }) {

  const [postList, setPostList] = useState(posts)

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-4">
        {postList.length === 0 && (
          <p className="text-center text-sm text-black/50">No posts from people you follow yet.</p>
        )}
        {postList.map((post) => (
          <PostCard key={post._id} post={post} href={`/status/${post._id}`} />
        ))}
      </div>

    </div>
  )
}