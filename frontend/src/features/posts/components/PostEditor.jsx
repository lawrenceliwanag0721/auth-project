'use client'

import React, { useState } from 'react'
import { updatePost as updatePostAction } from '@/app/actions/postActions'

export default function PostEditor({ post, onSave, onCancel }) {
  const [title, setTitle] = useState(post.title || '')
  const [content, setContent] = useState(post.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const savePost = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const updatedPost = await updatePostAction(post._id, {
        title: title.trim(),
        content: content.trim(),
      })
      onSave(updatedPost)
    } catch (updateError) {
      setError(updateError.message || 'Failed to update post.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
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
            event.preventDefault()
            event.stopPropagation()
            onCancel()
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
  )
}
