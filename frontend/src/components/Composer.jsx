'use client'

import React, { useRef, useState } from 'react'

import { ImagePlus } from 'lucide-react'

import { createPost } from '@/app/actions/createPost'

export default function Composer({ onCreatePost }) {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)

  const handlePost = async () => {

    if (!title.trim() || !content.trim()) return

    setLoading(true)

    try {

      const post = await createPost(title, content, image)

      console.log('Created:', post)

      onCreatePost(post)

      setTitle('')
      setContent('')
      setImage(null)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="bg-white border border-black/30 rounded-lg p-4 flex flex-col gap-3 w-full">

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full text-black placeholder:text-black/60 outline-none text-lg font-medium"
      />

      <textarea
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full resize-none text-black placeholder:text-black/60 outline-none text-lg"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="hidden"
      />

      <div className="flex flex-row items-center justify-between border-t border-black/10 pt-3">

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-black/50 hover:text-black transition-colors"
        >
          <ImagePlus size={18} />
        </button>

        <button
          onClick={handlePost}
          disabled={loading}
          className="bg-mist-900 text-white text-lg px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>

      </div>

    </div>
  )
}