'use client'

import React from 'react'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

export default function PostActionBar({ liked, likes, onToggleLike }) {
  const actions = [
    { key: 'like', icon: Heart, count: likes, active: liked, onClick: onToggleLike },
    { key: 'comment', icon: MessageCircle, count: 0 },
    { key: 'share', icon: Share2 },
    { key: 'save', icon: Bookmark, align: 'end' },
  ]

  return (
    <div className="flex flex-row items-center border-t border-black/10 pt-3 gap-6">
      {actions.map(({ key, icon: Icon, count, active, onClick, align }) => (
        <button
          key={key}
          onClick={onClick}
          className={`flex flex-row items-center gap-1.5 text-xs transition-colors ${
            active ? 'text-black' : 'text-black/50 hover:text-black'
          } ${align === 'end' ? 'ml-auto' : ''}`}
        >
          <Icon size={16} fill={active ? 'black' : 'none'} />
          {count !== undefined && <span>{count}</span>}
        </button>
      ))}
    </div>
  )
}
