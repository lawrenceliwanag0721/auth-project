'use client'
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deletePost as deletePostAction } from '@/app/actions/postActions'
import PostActionBar from './PostActionBar'
import PostEditor from './PostEditor'
import PostMenu from './PostMenu'

export default function PostCard({ post, isReply = false, href, onUpdate, onDelete }) {
  const router = useRouter()
  const [currentPost, setCurrentPost] = useState(post)
  const [now, setNow] = useState(null)
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const canManage = !isReply && (currentPost.canEdit || currentPost.canDelete)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(Date.now()))
    return () => cancelAnimationFrame(frame)
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

  if (isDeleted) return null

  const postBody = (
    <>
      {currentPost.title && (
        <h2 className="text-xl font-semibold text-black/80">
          {currentPost.title}
        </h2>
      )}

      <p className="text-lg text-black/90">{currentPost.content}</p>

      {currentPost.image && (
        <div className="w-full border min-h-45 border-black/30 rounded-lg flex items-center justify-center bg-black/2">
          <Image
            src={`http://localhost:5000${currentPost.image}`}
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
          <PostMenu
            isOpen={menuOpen}
            onToggle={(event) => {
              stopNavigation(event)
              setMenuOpen((open) => !open)
            }}
            onEdit={(event) => {
              stopNavigation(event)
              setMenuOpen(false)
              setError('')
              setIsEditing(true)
            }}
            onDelete={removePost}
          />
        )}
      </div>

      {isEditing ? (
        <PostEditor
          post={currentPost}
          onSave={(updatedPost) => {
            setCurrentPost((previous) => ({ ...previous, ...updatedPost }))
            setIsEditing(false)
            onUpdate?.(updatedPost)
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        href ? <Link href={href} className="flex flex-col gap-3">{postBody}</Link> : postBody
      )}
      {!isEditing && error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <PostActionBar liked={liked} likes={likes} onToggleLike={toggleLike} />
    </div>
  )
}
