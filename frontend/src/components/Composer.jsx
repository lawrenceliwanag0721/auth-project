import React from 'react'
import { ImagePlus } from 'lucide-react'
export default function Composer() {
  return (
    <div className="bg-white border border-black/30 rounded-lg p-4 flex flex-col gap-3 w-full">
      <textarea
        rows={2}
        placeholder="What's on your mind?"
        className="w-full resize-none text-black placeholder:text-black/60 outline-none text-lg"
      />
      <div className="flex flex-row items-center justify-between border-t border-black/10 pt-3">
        <button className="text-black/50 hover:text-black transition-colors">
          <ImagePlus size={18} />
        </button>
        <button className="bg-mist-900 text-white text-lg px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </div>
  )
}