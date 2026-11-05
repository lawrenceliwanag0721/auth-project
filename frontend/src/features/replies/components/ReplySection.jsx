'use client'

import React, { useState } from 'react'

import PostCard from '@/features/posts/components/Postcard'
import ReplyComposer from './ReplyComposer'

export default function ReplySection({ replies = [], postId }) {
  const [replyList, setReplyList] = useState(replies)

  const addReply = (newReply) => {
    setReplyList([newReply,...replyList])
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-2">
      {replyList.map((reply) => (
        <PostCard
          key={reply._id}
          post={reply}
          isReply={true}
        />
      ))}
      {replyList.length === 0 && (
        <p className="py-4 text-center text-sm text-black/50">No replies yet.</p>
      )}

      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white pb-8 px-8">
        <div className="w-full max-w-2xl">
          <ReplyComposer
            postId={postId}
            onCreateReply={addReply}
          />
        </div>
      </div>
    </div>
  )
}