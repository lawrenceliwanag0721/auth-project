"use client"
import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, ImagePlus } from 'lucide-react'

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

const glossKeyframes = `
@keyframes gloss {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}
`

function EditProfileButton() {
  const [glossing, setGlossing] = useState(false)

  const handleClick = () => {
    setGlossing(true)
    setTimeout(() => setGlossing(false), 650)
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden w-full bg-black text-white text-sm px-4 py-2 rounded-lg"
    >
      Edit Profile
      {glossing && (
        <span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: "gloss 0.65s ease-out" }}
        />
      )}
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
          <span className="text-sm text-black">{user.name}</span>
          <span className="text-xs text-black/50">{user.handle}</span>
        </div>
        <p className="text-xs text-black/70">{user.bio}</p>
      </div>

      <div className="flex flex-row justify-between border-t border-black/10 pt-3">
        {user.stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span className="text-sm text-black">{value}</span>
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
          className={`flex-1 py-3 text-sm transition-colors border-b ${
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
        className="w-full resize-none text-black placeholder:text-black/60 outline-none text-sm"
      />
      <div className="flex flex-row items-center justify-between border-t border-black/10 pt-3">
        <button className="text-black/50 hover:text-black transition-colors">
          <ImagePlus size={18} />
        </button>
        <button className="bg-mist-900 text-white text-sm px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </div>
  )
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;

    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }

  const toggleLike = () => {
    setLiked((prev) => !prev)
    setLikes((prev) => (liked ? prev - 1 : prev + 1))
  }

  const actions = [
    {
      key: "like",
      icon: Heart,
      count: likes,
      active: liked,
      onClick: toggleLike,
    },
    { key: "comment", icon: MessageCircle, count: 0 },
    { key: "share", icon: Share2 },
    { key: "save", icon: Bookmark, align: "end" },
  ]

  return (
    <div className="border border-black/30 rounded-lg p-4 flex flex-col gap-3 w-full">
      <div className="flex flex-row items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-black/30 flex items-center justify-center text-sm text-black">
          {post.author.username.charAt(0)}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm text-black">{post.author.username}</span>
          <span className="text-xs text-black/50">@{post.author.username} · {timeAgo(post.createdAt)}</span>
        </div>
      </div>

      <p className="text-sm text-black/90">{post.content}</p>

      {post.image && (
        <div className="w-full h-48 border border-black/30 rounded-lg flex items-center justify-center bg-black/[0.02]">
          <ImagePlus size={22} className="text-black/30" />
        </div>
      )}

      <div className="flex flex-row items-center border-t border-black/10 pt-3 gap-6">
        {actions.map(({ key, icon: Icon, count, active, onClick, align }) => (
          <button
            key={key}
            onClick={onClick}
            className={`flex flex-row items-center gap-1.5 text-xs transition-colors ${
              active ? "text-black" : "text-black/50 hover:text-black"
            } ${align === "end" ? "ml-auto" : ""}`}
          >
            <Icon size={16} fill={active ? "black" : "none"} />
            {count !== undefined && <span>{count}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function NewsFeed({ props }) {
  const [active, setActive] = useState("For You")

  return (
    <div className="bg-white rounded-lg flex flex-row w-full justify-center gap-6 px-8">
      <style>{glossKeyframes}</style>
      <div className="hidden xl:flex justify-end w-full max-w-sm p-4">
        <Sidebar user={USER}/>
      </div>
      <div className='w-full max-w-3xl p-4'>
        <div className="flex flex-col gap-4 flex-1">
          <Tabs active={active} setActive={setActive} />
          <Composer/>
          <div className="flex flex-col gap-4">
            {props.map((post) => (
              <PostCard key={post._id} post={post} />
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
