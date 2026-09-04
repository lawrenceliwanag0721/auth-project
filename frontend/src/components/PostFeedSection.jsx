'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import PostCard from './Postcard'
import Composer from './Composer'

export default function PostFeedSection({ posts }) {

  const [postList, setPostList] = useState(posts)

  const addPostToFeed = (newPost) => {
    setPostList([newPost, ...postList])
  }

  return (
    <div className="flex flex-col gap-4">
      <Composer
        onCreatePost={addPostToFeed}
      />
      <div className="flex flex-col gap-4">
        {postList.map((post) => (
          <Link
            key={post._id}
            href={`/status/${post._id}`}
          >
            <PostCard post={post} />
          </Link>
        ))}
      </div>
    </div>
  )
}