'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import PostCard from './Postcard'
const mockPosts = [
  {
    _id: "66f001",
    author: { _id: "user001", username: "john_doe" },
    content: "Just finished working on my new portfolio. Finally starting to feel like a real developer.",
    image: null,
    createdAt: "2026-09-01T01:30:00.000Z",
    likes: 24,
  },
  {
    _id: "66f002",
    author: { _id: "user002", username: "mika_dev" },
    content: "Spent the entire night debugging a problem that turned out to be a missing semicolon.",
    image: null,
    createdAt: "2026-08-31T22:15:00.000Z",
    likes: 47,
  },
  {
    _id: "66f003",
    author: { _id: "user003", username: "alexwrites" },
    content: "There is something satisfying about finally seeing a feature work after hours of development.",
    image: "mock-image-1",
    createdAt: "2026-08-31T18:45:00.000Z",
    likes: 89,
  },
  {
    _id: "66f004",
    author: { _id: "user004", username: "coffeeandcode" },
    content: "Morning coffee, clean code, and no unexpected errors. That's all I need today.",
    image: null,
    createdAt: "2026-08-31T09:20:00.000Z",
    likes: 13,
  },
  {
    _id: "66f005",
    author: { _id: "user005", username: "pixel_artist" },
    content: "Been experimenting with different layouts for my new project. I think this one finally works.",
    image: "mock-image-2",
    createdAt: "2026-08-30T16:10:00.000Z",
    likes: 126,
  },
  {
    _id: "66f006",
    author: { _id: "user006", username: "samuel_dev" },
    content: "Learning something new every day. Today it's MongoDB aggregation pipelines.",
    image: null,
    createdAt: "2026-08-29T14:05:00.000Z",
    likes: 31,
  },
  {
    _id: "66f007",
    author: { _id: "user007", username: "luna" },
    content: "Sometimes the best solution is to stop overengineering and just write the simple version.",
    image: null,
    createdAt: "2026-08-28T20:30:00.000Z",
    likes: 72,
  },
  {
    _id: "66f008",
    author: { _id: "user008", username: "devnathan" },
    content: "Finally deployed my application. Seeing your own project running on an actual server feels different.",
    image: "mock-image-3",
    createdAt: "2026-08-27T11:40:00.000Z",
    likes: 204,
  },
]
export default function FollowingFeedSection({ posts = mockPosts }) {

  const [postList, setPostList] = useState(posts)

  return (
    <div className="flex flex-col gap-4">

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