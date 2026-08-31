"use client"
import React, { useState } from 'react'
import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark, ImagePlus } from 'lucide-react'
import PostCard from './Postcard';
const POSTS = [
  {
    id: 1,
    name: "Aiko Tanaka",
    handle: "@aiko",
    time: "2h",
    content: "Shipped the new auth flow today. Cookies > localStorage for this one, fight me.",
    likes: 24,
    comments: 6,
    image: true,
  },
  {
    id: 2,
    name: "Marcus Reyes",
    handle: "@marcusr",
    time: "4h",
    content: "Refactored the whole dashboard into array-driven components. 40% less JSX, feels good.",
    likes: 58,
    comments: 12,
  },
  {
    id: 3,
    name: "Priya Nair",
    handle: "@priyan",
    time: "9h",
    content: "Reminder: CORS errors are usually a you problem, not a browser problem.",
    likes: 91,
    comments: 3,
  },
  {
    id: 4,
    name: "Elena Vasquez",
    handle: "@elenav",
    time: "11h",
    content: "TIL you can debug HMR issues over LAN by just checking your dev server's allowed hosts config first.",
    likes: 37,
    comments: 8,
  },
  {
    id: 5,
    name: "Jonah Kim",
    handle: "@jonahk",
    time: "13h",
    content: "Custom useForm hook finally feels right. No more prop-drilling validation state everywhere.",
    likes: 64,
    comments: 15,
    image: true,
  },
  {
    id: 6,
    name: "Fatima Al-Sayed",
    handle: "@fatimas",
    time: "1d",
    content: "JWT in an httpOnly cookie + short expiry + refresh route. Boring, but it works.",
    likes: 102,
    comments: 21,
  },
  {
    id: 7,
    name: "Devon Marsh",
    handle: "@devonm",
    time: "1d",
    content: "Admin dashboard CRUD is done. Turns out most of it really is just a table and a modal.",
    likes: 45,
    comments: 9,
  },
]

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
      Edit Profile
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

function Composer() {
  return (
    <div className="border border-black/30 rounded-lg p-4 flex flex-col gap-3 w-full">
      <textarea
        rows={2}
        placeholder="What's on your mind?"
        className="w-full resize-none text-black placeholder:text-black/60 outline-none text-lg"
      />
      <div className="flex flex-row items-center justify-between border-t border-black/10 pt-3">
        <button className="text-black/50 hover:text-black transition-colors">
          <ImagePlus size={18} />
        </button>
        <button className="bg-mist-900 text-white text-lg px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </div>
  )
}


export default function NewsFeed({ props }) {
  const [active, setActive] = useState("For You")

  return (
    <div className="bg-white rounded-lg flex flex-row w-full justify-center gap-6 px-8">
      <div className="hidden xl:flex justify-end w-full max-w-sm p-4">
        <Sidebar user={USER}/>
      </div>
      <div className='w-full max-w-2xl p-4'>
        <div className="flex flex-col gap-4 flex-1">
          <Tabs active={active} setActive={setActive} />
          <Composer/>
          <div className="flex flex-col gap-4">
            {props.map((post) => (
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
