import React from 'react'
import { TrendingUp } from 'lucide-react'

const trends = [
  { category: 'Technology · Trending', topic: 'Artificial Intelligence', posts: '12.8K posts' },
  { category: 'Design · Trending', topic: 'Design Systems', posts: '4,320 posts' },
  { category: 'Technology · Trending', topic: 'Next.js', posts: '2,105 posts' },
  { category: 'Community · Trending', topic: 'Build in Public', posts: '986 posts' },
]

export default function TrendingList() {
  return (
    <section
      aria-labelledby="trending-heading"
      className="sticky top-4 flex h-fit w-full max-w-64 flex-col overflow-hidden rounded-lg border border-black/10 bg-white"
    >
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3">
        <TrendingUp size={18} className="text-black/60" />
        <h2 id="trending-heading" className="text-lg font-semibold text-black">
          What&apos;s trending
        </h2>
      </div>

      <ol className="divide-y divide-black/5">
        {trends.map(({ category, topic, posts }, index) => (
          <li key={topic}>
            <div className="flex items-start justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/[0.03]">
              <div className="min-w-0">
                <p className="text-xs text-black/50">{category}</p>
                <p className="mt-1 truncate text-sm font-semibold text-black">{topic}</p>
                <p className="mt-1 text-xs text-black/50">{posts}</p>
              </div>
              <span className="pt-0.5 text-xs text-black/35">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="border-t border-black/10 px-4 py-3 text-xs text-black/45">
        Trending topics are a preview.
      </p>
    </section>
  )
}
