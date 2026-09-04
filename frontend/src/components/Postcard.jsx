'use client'
import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, ImagePlus } from 'lucide-react'

export default function PostCard({ post, isReply = false }) {
  const [liked, setLiked] = useState(post.liked)
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

  const toggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await fetch(
      `http://localhost:5000/api/post/like/${post._id}`,
      {
          method: liked ? "DELETE" : "POST",
          credentials: "include"
      }
    );
    if (!response.ok) return;
    setLiked(prev => !prev);
  };

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
    <div
      className={`p-4 flex flex-col gap-3 w-full ${
        isReply ? ' border-black/15 ' : 'rounded-lg border border-black/30'
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="w-9 h-9 rounded-full border border-black/30 flex items-center justify-center text-sm text-black">
          {post.author.username.charAt(0)}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg text-black">{post.author.username}</span>
          <span className="text-xs text-black/50">@{post.author.username} · {timeAgo(post.createdAt)}</span>
        </div>
      </div>

      <p className="text-lg text-black/90">{post.content}</p>

      {post.image && (
        <div className="w-full border border-black/30 rounded-lg flex items-center justify-center bg-black/[0.02]">
          <img className="rounded-lg" src={`http://localhost:5000${post.image}`}/>
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