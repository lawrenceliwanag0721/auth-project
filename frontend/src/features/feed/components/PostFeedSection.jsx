'use client'
import React, { useState } from 'react'
import PostCard from '@/features/posts/components/Postcard'
import Composer from './Composer'

export default function PostFeedSection({ posts }) {
  const [postList, setPostList] = useState(posts)

  const addPostToFeed = (newPost) => {
    setPostList((posts) => [newPost, ...posts])
  }

  const updatePostInFeed = (updatedPost) => {
    setPostList((posts) => posts.map((post) => (
      post._id === updatedPost._id ? { ...post, ...updatedPost } : post
    )))
  }

  const removePostFromFeed = (postId) => {
    setPostList((posts) => posts.filter((post) => post._id !== postId))
  }

  return (
    <div className="flex flex-col gap-4">
      <Composer
        onCreatePost={addPostToFeed}
      />
      <div className="flex flex-col gap-4">
        {postList.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            href={`/status/${post._id}`}
            onUpdate={updatePostInFeed}
            onDelete={removePostFromFeed}
          />
        ))}
      </div>
    </div>
  )
}