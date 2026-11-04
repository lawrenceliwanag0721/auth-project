'use client'
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { deletePost as deletePostAction, updatePost as updatePostAction } from '@/app/actions/postActions'

export default function PostCard({ post, isReply = false, href, onUpdate, onDelete }) {
  const router = useRouter()
  const [currentPost, setCurrentPost] = useState(post)
  const [now, setNow] = useState(null)
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(post.title || '')
  const [content, setContent] = useState(post.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const canManage = !isReply && (currentPost.canEdit || currentPost.canDelete)

  useEffect(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0)
    return () => clearTimeout(timer)
  }, [])

  const stopNavigation = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  function timeAgo(date, currentTime) {
    if (currentTime === null) return ''
    const seconds = Math.floor((currentTime - new Date(date).getTime()) / 1000);

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

  const savePost = async (event) => {
    stopNavigation(event)
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const updatedPost = await updatePostAction(currentPost._id, {
        title: title.trim(),
        content: content.trim(),
      })
      setCurrentPost((previous) => ({ ...previous, ...updatedPost }))
      setIsEditing(false)
      onUpdate?.(updatedPost)
    } catch (updateError) {
      setError(updateError.message || 'Failed to update post.')
    } finally {
      setIsSaving(false)
    }
  }

  const removePost = async (event) => {
    stopNavigation(event)
    if (!window.confirm('Delete this post?')) return

    setError('')
    try {
      await deletePostAction(currentPost._id)
      if (onDelete) {
        onDelete(currentPost._id)
      } else {
        setIsDeleted(true)
        router.replace('/home')
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete post.')
    }
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

  if (isDeleted) return null

  const imageSrc = currentPost.image?.startsWith('/')
    ? `http://localhost:5000${currentPost.image}`
    : null

  const postBody = (
    <>
      {currentPost.title && (
        <h2 className="text-xl font-semibold text-black/80">
          {currentPost.title}
        </h2>
      )}

      <p className="text-lg text-black/90">{currentPost.content}</p>

      {imageSrc && (
        <div className="w-full border min-h-45 border-black/30 rounded-lg flex items-center justify-center bg-black/2">
          <Image
            src={imageSrc}
            alt={currentPost.title || "Post image"}
            width={800}
            height={600}
            className="rounded-lg"
          />
        </div>
      )}
    </>
  )

  return (
    <div
      className={`p-4 flex flex-col gap-3 w-full ${
        isReply ? ' ' : 'rounded-lg border border-black/10 hover:border-black/30'
      }`}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex flex-row items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-black/30 flex items-center justify-center text-sm text-black">
            {currentPost.author.username.charAt(0)}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg text-black">{currentPost.author.username}</span>
            <span className="text-xs text-black/50">
              @{currentPost.author.username} · {timeAgo(currentPost.createdAt, now)}
            </span>
          </div>
        </div>

        {canManage && (
          <div className="relative">
            <button
              type="button"
              aria-label="Post options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={(event) => {
                stopNavigation(event)
                setMenuOpen((open) => !open)
              }}
              className="rounded-full p-2 text-black/60 hover:bg-black/5 hover:text-black"
            >
              <MoreHorizontal size={20} />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full z-10 mt-1 min-w-36 rounded-lg border border-black/10 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  role="menuitem"
                  onClick={(event) => {
                    stopNavigation(event)
                    setMenuOpen(false)
                    setError('')
                    setIsEditing(true)
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-black hover:bg-black/5"
                >
                  <Pencil size={16} />
                  Edit post
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={removePost}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={savePost} onClick={(event) => event.stopPropagation()} className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            required
            aria-label="Post title"
            className="w-full rounded-md border border-black/20 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black/30"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            aria-label="Post content"
            rows={4}
            className="w-full resize-y rounded-md border border-black/20 px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black/30"
          />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={(event) => {
                stopNavigation(event)
                setTitle(currentPost.title || '')
                setContent(currentPost.content || '')
                setError('')
                setIsEditing(false)
              }}
              className="rounded-lg border border-black/20 px-3 py-2 text-sm text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-mist-900 px-3 py-2 text-sm text-white disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        href ? <Link href={href} className="flex flex-col gap-3">{postBody}</Link> : postBody
      )}
      {!isEditing && error && <p role="alert" className="text-sm text-red-600">{error}</p>}

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
