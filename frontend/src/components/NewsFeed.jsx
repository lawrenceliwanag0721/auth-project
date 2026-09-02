"use client"
import React, { useState } from 'react'
import Link from "next/link";
import PostCard from './Postcard';
import Composer from './Composer';

const USER = {
  name: "Aruji Dono",
  handle: "@arujidono",
  bio: "Building full-stack apps. React / Node / MongoDB.",
  stats: [
    { label: "Posts", value: 12 },
    { label: "Followers", value: 340 },
    { label: "Following", value: 128 },
  ],
}

function EditProfileButton() {
  const handleClick = () => {

  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden w-full bg-black text-white text-lg px-4 py-2 rounded-lg">
      Profile
    </button>
  )
}

function Sidebar({ user }) {
  return (
    <div className="flex flex-col gap-4 w-64 h-fit sticky top-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-16 h-16 rounded-full border border-black/30 flex items-center justify-center text-xl text-black">
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg text-black">{user.name}</span>
          <span className="text-xs text-black/50">{user.handle}</span>
        </div>
        <p className="text-xs text-black/70">{user.bio}</p>
      </div>

      <div className="flex flex-row justify-between border-t border-black/10 pt-3">
        {user.stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-lg text-black">{value}</span>
            <span className="text-xs text-black/50">{label}</span>
          </div>
        ))}
      </div>

      <EditProfileButton />
    </div>
  )
}

function Tabs({ active, setActive }) {
  const tabs = ["For You", "Following"]
  return (
    <div className="flex flex-row w-full sticky top-0 bg-white z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`flex-1 py-3 text-lg transition-colors border-b ${
            active === tab
              ? "text-black border-black"
              : "text-black/40 border-black/10 hover:text-black/70"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default function NewsFeed({ initialProps }) {
  const [active, setActive] = useState("For You")
  let [posts, setPosts] = useState(initialProps);

  const addPost = (newPost) => {
    setPosts([newPost,...posts])
  }

  return (
    <div className="bg-white rounded-lg flex flex-row w-full justify-center gap-6 px-8">
      <div className="hidden xl:flex justify-end w-full max-w-sm p-4">
        <Sidebar user={USER}/>
      </div>
      <div className='w-full max-w-2xl p-4'>
        <div className="flex flex-col gap-4 flex-1">
          <Tabs active={active} setActive={setActive} />
          <Composer onCreatePost={addPost}/>
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <Link key={post._id} href={`status/${post._id}`}>
                <PostCard key={post._id} post={post} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden xl:flex justify-end w-full max-w-sm p-4">
            {/* filler field */}
      </div>
    </div>
  )
}
