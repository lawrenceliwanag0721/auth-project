'use client'

import React from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export default function PostMenu({ isOpen, onToggle, onEdit, onDelete }) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Post options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="rounded-full p-2 text-black/60 hover:bg-black/5 hover:text-black"
      >
        <MoreHorizontal size={20} />
      </button>
      {isOpen && (
        <div role="menu" className="absolute right-0 top-full z-10 mt-1 min-w-36 rounded-lg border border-black/10 bg-white p-1 shadow-lg">
          <button
            type="button"
            role="menuitem"
            onClick={onEdit}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-black hover:bg-black/5"
          >
            <Pencil size={16} />
            Edit post
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onDelete}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete post
          </button>
        </div>
      )}
    </div>
  )
}
