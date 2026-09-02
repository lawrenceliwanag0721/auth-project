'use client'

import React, { useState } from 'react'
import { replyToPost } from '@/app/actions/replytoPost'

export default function ReplyComposer({ postId, onCreateReply }) {

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReply = async () => {

    if (!content.trim()) return

    setLoading(true)

    try {
      const reply = await replyToPost(postId, content)
      console.log('Created:', reply)
      onCreateReply(reply)
      setContent('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-black/30 rounded-lg p-4 flex flex-col gap-3 w-full">

      <textarea
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full resize-none text-black placeholder:text-black/60 outline-none text-lg"
      />

      <div className="flex flex-row items-center justify-between border-t border-black/10 pt-3">

        <button className="text-black/50 hover:text-black transition-colors">
        </button>

        <button
          onClick={handleReply}
          disabled={loading}
          className="bg-mist-900 text-white text-lg px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Replying...' : 'Reply'}
        </button>

      </div>

    </div>
  )
}