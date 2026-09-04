'use client'

import React, { useState } from 'react'

import Sidebar from './Sidebar'
import Tabs from './Tabs'
import PostFeedSection from './PostFeedSection'
import FollowingFeedSection from './FollowingFeedSection'

const USER = {
  name: "Aruji Dono",
  handle: "@arujidono",
  bio: "Building full-stack apps. React / Node / MongoDB.",
  stats: [
    { label: "Posts", value: 12 },
    { label: "Followers", value: 340 },
    { label: "Following", value: 128 },
  ],
}

export default function NewsFeed({ initialProps }) {

  const [active, setActive] = useState("For You")

  return (
    <main className="bg-white rounded-lg flex flex-row w-full justify-center gap-6 px-8">
      <aside className="hidden xl:flex justify-end w-full max-w-sm p-4 h-auto">
        <Sidebar user={USER} />
      </aside>

      <section className="w-full max-w-2xl p-4">
        <div className="flex flex-col gap-4">
          <Tabs
            active={active}
            setActive={setActive}
          />
          {active === "For You" && <PostFeedSection posts={initialProps} />}
          {active === "Following" && <FollowingFeedSection/>}
        </div>
      </section>

      <aside className="hidden xl:flex justify-end w-full max-w-sm p-4">
        {/* filler field */}
      </aside>
    </main>
  )
}